"""AI Client for LLM-powered threat generation using LiteLLM."""

import json
import re
import logging
from pathlib import Path
from typing import Dict, List, Tuple
import litellm
from models import AIThreatsResponseList

PROJECT_ROOT = Path(__file__).parent.parent
PROMPT_FILE = PROJECT_ROOT / "prompt.txt"


def generate_threats(schema: Dict, model: Dict, api_key: str, model_name: str, temperature: float = 0.1, response_format: bool = False, api_base: str = None, timeout: int = 900) -> Tuple[Dict[str, List[Dict]], float]:
    """Generate AI-powered threats for all in-scope components.
    
    Returns:
        tuple: (threats_data, response_cost)
    """
    logger = logging.getLogger("threat_modeling.ai_client")
    logger.info("Starting threat generation...")
    
    # Load prompt template and inject schema/model data
    prompt_template = PROMPT_FILE.read_text(encoding='utf-8')
    
    system_prompt = prompt_template.format(
        schema_json=json.dumps(schema, indent=2, ensure_ascii=False),
        model_json=json.dumps(model, indent=2, ensure_ascii=False)
    )
    

    logger.info(f"Calling LLM: {model_name}")

    # Configure JSON schema validation
    litellm.enable_json_schema_validation = response_format
    litellm.drop_params = True

    # Prepare messages for LLM API call
    messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Analyze provided Threat Dragon model, generate threats and mitigations for elements and return a valid JSON following the rules."}
        ]

    logger.info(f"System token count: {litellm.token_counter(model=model_name, messages=messages)}")

    try:
        max_tokens = int(litellm.get_max_tokens(model=model_name))
    except Exception as e:
        logger.error(f"Problem with getting max tokens: Using default value of 100000.")
        max_tokens = 100000

    # Build API completion parameters
    completion_params = {
        "model": model_name,
        "messages": messages,
        "temperature": temperature,
        "timeout": timeout,
        "max_tokens": max_tokens,
        "api_key": api_key,
        "response_format": AIThreatsResponseList if response_format else None
    }
    
    if api_base:
        completion_params["api_base"] = api_base
    
    # Call LLM API
    response = litellm.completion(**completion_params)

    # Extract response cost
    response_cost = response._hidden_params.get("response_cost", 0.0)
    logger.info(f"Response cost: {response_cost}")
    logger.debug(f"\n\nResponse: {response}")
    
    # Parse and validate AI response
    try:
        ai_response = AIThreatsResponseList.model_validate_json(response.choices[0].message.content)
    except Exception:
        # Fallback: try to extract JSON from markdown or plain text
        logger.warning("LLM returned invalid JSON. Trying to extract JSON...")
        # Look for JSON object containing "items" key (our expected format)
        match = re.search(r'\{\s*"items"\s*:\s*\[.*?\]\s*\}', response.choices[0].message.content, re.S)
        if match:
            ai_response = AIThreatsResponseList.model_validate_json(match.group())
        else:
            raise
    
    logger.debug(f"\n\nAI Response: {ai_response}")
    
    # Convert Pydantic models to dictionaries
    threats_data = {
        item.id: [threat.model_dump() for threat in item.threats] 
        for item in ai_response.items
    }
    
    total_threats = sum(len(threats) for threats in threats_data.values())
    logger.info(f"Generated {total_threats} threats for {len(threats_data)} elements")
    
    return threats_data, response_cost