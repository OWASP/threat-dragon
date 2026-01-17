"""AI-Powered Threat Modeling Tool - Generate threats for Threat Dragon models using LLMs."""

import json
import logging
import argparse
import io
import sys
from datetime import datetime
from pathlib import Path
from utils import update_threats_in_memory
from ai_client import generate_threats
from validator import ThreatValidator


def parse_arguments():
    """Parse and validate command-line arguments."""
    parser = argparse.ArgumentParser(
        description='AI-Powered Threat Modeling Tool - Generate threats for Threat Dragon models using LLMs'
    )
    
    parser.add_argument(
        '--settings-json',
        type=str,
        required=True,
        help='AI settings JSON file location (full path including filename)'
    )
    
    parser.add_argument(
        '--logs-folder',
        type=str,
        required=True,
        help='Logs folder location (full path to logs directory)'
    )
    
    args = parser.parse_args()
    
    # Validate settings file exists
    if not Path(args.settings_json).exists():
        print(f"ERROR: Settings JSON file not found: {args.settings_json}")
        raise SystemExit(1)
   
    return args


def read_data_from_stdin():
    """Read data from stdin: API key on first line, model JSON on second line, schema JSON on third line."""
    try:
        # Ensure stdin is read as UTF-8 regardless of system locale
        if sys.stdin.encoding and sys.stdin.encoding.lower() != "utf-8":
            sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding="utf-8")

        # Read API key from first line (never log this)
        api_key_line = sys.stdin.readline()
        if not api_key_line:
            raise ValueError("No API key provided in stdin")
        api_key = api_key_line.rstrip('\n')

        # Read model JSON from second line
        model_json_line = sys.stdin.readline()
        if not model_json_line:
            raise ValueError("No model JSON data provided in stdin")
        model = json.loads(model_json_line.strip())

        # Read schema JSON from third line
        schema_json_line = sys.stdin.readline()
        if not schema_json_line:
            raise ValueError("No schema JSON data provided in stdin")
        schema = json.loads(schema_json_line.strip())

        return api_key, model, schema

    except UnicodeDecodeError as e:
        raise ValueError(f"Unicode decoding error reading stdin: {str(e)}")
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in stdin: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error reading from stdin: {str(e)}")



def load_settings(settings_json_path: str) -> dict:
    """Load AI settings from JSON file (API key is passed via stdin, not stored here)."""
    settings_path = Path(settings_json_path)
    
    if not settings_path.exists():
        raise FileNotFoundError(f"Settings file not found: {settings_path}")
    
    # Load settings from JSON file
    with open(settings_path, 'r', encoding='utf-8') as f:
        settings = json.load(f)
    
    # Extract settings with defaults
    result = {
        'llm_model': settings.get('llmModel', ''),
        'temperature': settings.get('temperature', 0.1),
        'response_format': settings.get('responseFormat', False),
        'api_base': settings.get('apiBase', ''),
        'log_level': settings.get('logLevel', 'INFO'),
        'timeout': settings.get('timeout', 900)
    }
    
    # Validate temperature range
    if not (0 <= result['temperature'] <= 2):
        raise ValueError(f"Temperature {result['temperature']} is out of range (0-2)")
    
    # Validate log level
    if result['log_level'] not in ['INFO', 'DEBUG']:
        raise ValueError(f"Log level must be INFO or DEBUG, got: {result['log_level']}")
    
    # Validate timeout
    if not isinstance(result['timeout'], int) or result['timeout'] < 1:
        raise ValueError(f"Timeout must be a positive integer, got: {result['timeout']}")
    
    # Note: API key is not loaded here - it's passed via stdin
    
    return result


def setup_logging(logs_folder: Path, log_level: str = 'INFO'):
    """Configure logging with both file and console handlers."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_path = logs_folder / f"threat_modeling_{timestamp}.log"
    logs_folder.mkdir(parents=True, exist_ok=True)

    # Create logger instance (not root logger to avoid conflicts)
    logger = logging.getLogger("threat_modeling")
    logger.setLevel(logging.DEBUG)
    logger.propagate = False
    logger.handlers.clear()

    # File handler: only enabled in DEBUG mode for detailed logs
    if log_level.upper() == 'DEBUG':
        file_handler = logging.FileHandler(str(log_path), encoding="utf-8")
        file_handler.setLevel(logging.DEBUG)
        file_fmt = logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s")
        file_handler.setFormatter(file_fmt)
        logger.addHandler(file_handler)

    # Console handler: always enabled for INFO+ messages
    # Explicitly write to stderr to avoid interfering with stdout JSON output
    console_handler = logging.StreamHandler(sys.stderr)
    console_handler.setLevel(logging.INFO)
    console_fmt = logging.Formatter("%(message)s")
    console_handler.setFormatter(console_fmt)
    logger.addHandler(console_handler)

    return logger


def main():
    """Main application entry point."""
    
    # Set UTF-8 encoding for stdout/stderr (important for Windows)
    if hasattr(sys.stdout, 'buffer') and not isinstance(sys.stdout, io.TextIOWrapper):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)
    if hasattr(sys.stderr, 'buffer') and not isinstance(sys.stderr, io.TextIOWrapper):
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace', line_buffering=True)
    
    # Parse command-line arguments
    args = parse_arguments()
    
    # Load settings from JSON file
    try:
        settings = load_settings(args.settings_json)
    except Exception as e:
        print(f"ERROR: Failed to load settings: {str(e)}")
        raise SystemExit(1)
    
    # Initialize logging system
    logs_folder = Path(args.logs_folder)
    logger = setup_logging(logs_folder, settings['log_level'])
    
    logger.info("="*60)
    logger.info("STARTING AI-POWERED THREAT MODELING TOOL")
    logger.info("="*60)
    
    # Display configuration
    logger.info("Configuration:")
    logger.info(f"  LLM Model: {settings['llm_model']}")
    logger.info(f"  Temperature: {settings['temperature']}")
    logger.info(f"  Response Format: {settings['response_format']}")
    logger.info(f"  API Base: {settings['api_base'] if settings['api_base'] else 'None'}")
    logger.info(f"  Log Level: {settings['log_level']}")
    
    # Load API key, threat model and schema from stdin
    # API key on first line, model JSON on second line, schema JSON on third line
    logger.info("Loading API key, threat model and schema from stdin...")
    try:
        api_key, model, schema = read_data_from_stdin()
        if not api_key or api_key.strip() == '':
            raise ValueError("API key is empty")
        logger.debug(f"Loaded threat model with {len(model.get('detail', {}).get('diagrams', []))} diagram(s)")
    except Exception as e:
        logger.error(f"ERROR: {str(e)}", exc_info=True)
        raise SystemExit(1)
    
    # Generate threats using AI
    logger.info("Generating threats...")
    response_cost = 0.0
    try:
        threats_data, response_cost = generate_threats(
            schema, 
            model, 
            api_key,
            settings['llm_model'],            
            settings['temperature'],
            settings['response_format'],
            settings['api_base'] if settings['api_base'] else None,
            settings['timeout']
        )
    except Exception as e:
        logger.error(f"ERROR: {str(e)}", exc_info=True)
        raise SystemExit(1)
    
    # Log detailed threat information (DEBUG only)
    logger.debug("AI Response Details:")
    for elem_id, threats in threats_data.items():
        logger.debug(f"  Element {elem_id}: {len(threats)} threats")
        for i, threat in enumerate(threats):
            logger.debug(f"    Threat {i+1}: {threat.get('title', 'No title')} ({threat.get('severity', 'Unknown severity')}) - {threat.get('status', 'Unknown status')}")
    
    # Update threat model in memory with generated threats
    logger.info("Updating threat model with generated threats...")
    updated_model = update_threats_in_memory(model, threats_data)
    logger.info(f"Updated {len(threats_data)} element(s) with threats")
    
    # Validate AI response quality
    validation_result = None
    try:
        logger.info("Validating AI response...")
        # Use the logs folder from command-line arguments (writable location)
        validator = ThreatValidator(log_level=settings['log_level'], logs_dir=logs_folder)
        
        # Convert threats data to validation format
        ai_response_format = [
            {'id': elem_id, 'threats': threats} 
            for elem_id, threats in threats_data.items()
        ]
        
        validation_result = validator.validate_ai_response(updated_model, ai_response_format, 'memory')
        validator.print_summary(validation_result)
        logger.info("Validation completed successfully")
            
    except Exception as e:
        logger.error(f"Validation error: {str(e)}", exc_info=True)
        # Even if validation fails, we should still try to provide basic stats
        # This ensures the results window can still display something
        try:
            from validator import ValidationResult
            # Create a minimal validation result with basic stats
            total_threats = sum(len(threats) for threats in threats_data.values())
            validation_result = ValidationResult(
                is_valid=False,
                missing_elements=[],
                invalid_ids=[],
                warnings=[f"Validation failed: {str(e)}"],
                info=[],
                stats={
                    'in_scope_elements': 0,
                    'elements_with_threats': len(threats_data),
                    'total_threats': total_threats,
                    'coverage_percent': 0.0
                }
            )
        except Exception as fallback_error:
            logger.error(f"Failed to create fallback validation result: {str(fallback_error)}")
    
    logger.info("="*60)
    logger.info("THREAT MODELING PROCESS COMPLETED")
    logger.info("="*60)
    
    # Output updated model as JSON to stdout
    sys.stdout.write("<<JSON_START>>\n")
    json.dump(updated_model, sys.stdout, separators=(',', ':'), ensure_ascii=False)
    sys.stdout.write("\n<<JSON_END>>\n")
    
    # Output cost and validation metadata
    sys.stdout.write("<<METADATA_START>>\n")
    metadata = {
        "cost": response_cost,
        "validation": None
    }
    
    # Always include validation data if available, even if validation had errors
    if validation_result is not None:
        metadata["validation"] = {
            "is_valid": validation_result.is_valid,
            "stats": validation_result.stats,
            "warnings": validation_result.warnings,
            "info": validation_result.info,
            "has_errors": not validation_result.is_valid
        }
        logger.debug(f"Validation data included in metadata: is_valid={validation_result.is_valid}, stats={validation_result.stats}")
    else:
        # Last resort: create minimal validation data from threats_data
        logger.warning("Validation result is None - creating minimal validation data from threats")
        total_threats = sum(len(threats) for threats in threats_data.values())
        metadata["validation"] = {
            "is_valid": False,
            "stats": {
                'in_scope_elements': 0,
                'elements_with_threats': len(threats_data),
                'total_threats': total_threats,
                'coverage_percent': 0.0
            },
            "warnings": ["Validation was not performed - statistics may be incomplete"],
            "info": [],
            "has_errors": True
        }
    
    json.dump(metadata, sys.stdout, separators=(',', ':'), ensure_ascii=False)
    sys.stdout.write("\n<<METADATA_END>>\n")
    sys.stdout.flush()
    


if __name__ == "__main__":
    main()