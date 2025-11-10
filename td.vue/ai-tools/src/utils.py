"""Utility functions for file operations and threat model updates."""

import json
import uuid
import logging
import platform
import re
import keyring
from pathlib import Path
from typing import Union

logger = logging.getLogger(__name__)

def _windows_lookups(service: str, account: str):
    # Normal split fields
    yield (service, account)
    # Windows "target name" variants seen with some backends
    yield (f"{service}/{account}", account)
    yield (f"{service}/{account}", "")
    yield (f"{service}:{account}", account)

def _looks_like_backslash_u_stream(s: str) -> bool:
    # One or more \uXXXX sequences, no other chars
    return bool(re.fullmatch(r"(\\u[0-9a-fA-F]{4})+", s))

def _fix_backslash_u_utf16le_stream(s: str) -> str:

    # Step 1: turn literal backslash-u escapes into real codepoints
    chars = s.encode("utf-8").decode("unicode_escape")
    # Step 2: convert each 16-bit unit to bytes (little-endian)
    data = bytearray()
    for ch in chars:
        data.extend(ord(ch).to_bytes(2, "little"))
    # Step 3: decode to text (ASCII/UTF-8 API keys work here)
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        # Fallback: most API keys are ASCII; latin1 keeps bytes 0–255 as-is
        return data.decode("latin1")

def get_api_key(service: str, account: str) -> str | None:
    """Retrieve API key from credential manager with Windows compatibility."""
    tried = set()
    for svc, acc in (_windows_lookups(service, account) if platform.system() == "Windows"
                     else [(service, account)]):
        if (svc, acc) in tried:
            continue
        tried.add((svc, acc))
        pw = keyring.get_password(svc, acc)
        if pw:
            # Auto-repair Windows mojibake encoding issues
            if _looks_like_backslash_u_stream(pw):
                pw = _fix_backslash_u_utf16le_stream(pw)
            else:
                # Check for CJK/private-use characters (likely encoding issue)
                cjkish = sum(1 for ch in pw if 0x3400 <= ord(ch) <= 0x9FFF or 0xE000 <= ord(ch) <= 0xF8FF)
                if cjkish > max(8, len(pw)//2):
                    data = bytearray()
                    for ch in pw:
                        data.extend(ord(ch).to_bytes(2, "little"))
                    try:
                        pw = data.decode("utf-8")
                    except UnicodeDecodeError:
                        pw = data.decode("latin1")
            return pw
    return None


def load_json(path: Union[str, Path]) -> dict:
    """Load and parse a JSON file."""
    logger.info(f"Loading JSON from {path}")
    with open(str(path), 'r') as f:
        return json.load(f)


def update_threats_in_memory(model: dict, threats_data: dict) -> dict:
    """Update threat model in memory with AI-generated threats and visual indicators."""
    logger.info("Updating threats in memory")
    
    updated_count = 0
    
    # Iterate through all diagrams and cells
    for diagram in model.get('detail', {}).get('diagrams', []):
        for cell in diagram.get('cells', []):
            cell_id = cell.get('id')
            
            # Skip if this cell doesn't have generated threats
            if cell_id in threats_data:
                # Skip out-of-scope components and trust boundaries
                if cell.get('data', {}).get('outOfScope') or cell.get('shape', '') in ['trust-boundary-box', 'trust-boundary-curve']:
                    continue
                
                # Ensure cell has data object
                if 'data' not in cell:
                    cell['data'] = {}
                
                # Add unique IDs to threats if missing
                threats_with_ids = []
                for threat in threats_data[cell_id]:
                    if 'id' not in threat:
                        threat['id'] = str(uuid.uuid4())
                    threats_with_ids.append(threat)
                
                # Update cell with new threats
                cell['data']['threats'] = threats_with_ids
                
                # Update hasOpenThreats flag based on threat status
                if 'hasOpenThreats' in cell['data']:
                    cell['data']['hasOpenThreats'] = any(
                        t.get('status', 'Open') == 'Open' for t in threats_data[cell_id]
                    )
                
                # Add visual indicator (red stroke) for cells with threats
                _add_red_stroke(cell)
                updated_count += 1
    
    logger.info(f"Updated {updated_count} cells with threats")
    return model


def _add_red_stroke(cell: dict) -> None:
    """Add red stroke visual indicator to threat-bearing cells."""
    if 'attrs' not in cell:
        cell['attrs'] = {'stroke': 'red'}
        return
    
    attrs = cell['attrs']
    # Different cell shapes store stroke in different locations
    if 'line' in attrs:
        attrs['line']['stroke'] = 'red'
    elif 'body' in attrs:
        attrs['body']['stroke'] = 'red'
    elif 'topLine' in attrs:
        attrs['topLine']['stroke'] = 'red'
        if 'bottomLine' in attrs:
            attrs['bottomLine']['stroke'] = 'red'
    else:
        attrs['stroke'] = 'red'