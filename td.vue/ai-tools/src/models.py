"""Simplified Pydantic models for AI threat generation."""

from pydantic import BaseModel, Field, RootModel
from typing import List


class Threats(BaseModel):
    """Individual threat model."""
    title: str
    status: str = Field(pattern=r"^(NA|Open|Mitigated)$")
    severity: str = Field(pattern=r"^(High|Medium|Low)$")
    type: str
    description: str
    mitigation: str
    modelType: str = Field(pattern=r"^(STRIDE|LINDDUN|CIA|DIEF|RANSOM|PLOT4ai|Generic)$")

class AIThreatsResponse(BaseModel):
    """AI response for a single element."""
    id: str = Field(description="Element ID")
    threats: List[Threats] = Field(description="List of threats for the element")


class AIThreatsResponseList(BaseModel):
    """List of AI threat responses."""
    items: List[AIThreatsResponse] = Field(description="List of threat responses")
