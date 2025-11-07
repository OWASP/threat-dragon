"""Utility functions for file operations and threat model updates."""

import json
import uuid
import logging
from pathlib import Path
from typing import Union

logger = logging.getLogger(__name__)


def handle_user_friendly_error(error: Exception, error_type: str, logger_instance: logging.Logger = None) -> str:
    """Convert technical errors into user-friendly messages while logging full details."""
    if logger_instance is None:
        logger_instance = logger
    
    # Log full error details as DEBUG
    logger_instance.debug(f"Full error details for {error_type}: {str(error)}", exc_info=True)
    
    # Return user-friendly messages
    error_str = str(error).lower()
    
    if error_type == "api_key":
            return "ERROR: API key error. Please verify your API key is correct."
    
    elif error_type == "llm_model":
        if "litellm.NotFoundError".lower() in error_str:
            return "ERROR: Model not found or no access. Please check if the model exists and you have access to it."
        elif "litellm.BadRequestError".lower() in error_str:
            return "ERROR: LLM provider not recognized. Please use the correct format (e.g., 'openai/gpt-4', 'anthropic/claude-3')"
    
    elif error_type == "model_file":
        if "not found" in error_str or "no such file" in error_str:
            return "ERROR: Threat Dragon model file not found. Please check the file path."
        elif "permission" in error_str or "access" in error_str:
            return "ERROR: Cannot access Threat Dragon model file. Please check file permissions."
        elif "invalid" in error_str or "malformed" in error_str:
            return "ERROR: Invalid Threat Dragon model file format. Please ensure it's a valid JSON file."
        else:
            return "ERROR: Threat Dragon model file error. Please verify the file path and format."
    
    elif error_type == "temperature":
        if "range" in error_str or "invalid" in error_str:
            return "ERROR: Invalid temperature value. Please use a value between 0 and 2."
    
    elif error_type == "api_base":
            return "ERROR: InternalServerError. Please verify the API base URL is correct or enable DEBUG logging for more details and check log files."
    
    elif error_type == "response_format":
            return "ERROR: Response format error. Please try again or disable response format."
    
    else:
        return "ERROR: Unknown error occurred. Please enable DEBUG logging for more details and check log files."


def load_json(path: Union[str, Path]) -> dict:
    """Load and parse a JSON file."""
    logger.info(f"Loading JSON from {path}")
    with open(str(path), 'r') as f:
        return json.load(f)


def update_threats_in_file(file_path: Union[str, Path], threats_data: dict) -> None:
    """Update threat model file with AI-generated threats and visual indicators."""
    logger.info(f"Updating threats in file: {file_path}")
    
    # Load existing threat model
    with open(str(file_path), 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    
    # Iterate through all diagrams and cells
    for diagram in data.get('detail', {}).get('diagrams', []):
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
    
    # Save updated model back to file
    with open(str(file_path), 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, separators=(',', ': '), ensure_ascii=False)
    
    logger.info(f"Updated {updated_count} cells with threats")


def _add_red_stroke(cell: dict) -> None:
    """Add red stroke visual indicator to threat-bearing cells (different shapes need different attributes)."""
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