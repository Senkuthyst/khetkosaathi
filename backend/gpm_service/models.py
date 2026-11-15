from typing import Optional, List
from pydantic import BaseModel, Field

class GpmPointSample(BaseModel):
    date: str
    precipitation_mm: Optional[float] = None
    precipitation_rate_mm_hr: Optional[float] = None
    quality_status: str

class GpmImergResponse(BaseModel):
    source: str = "NASA GPM IMERG"
    product: str = "IMERG-LR"
    version: str = "V07B"
    productType: str = "NRT"
    status: str
    precipitation: Optional[float] = None
    unit: Optional[str] = "mm (7-day accumulation)"
    observationStart: Optional[str] = None
    observationEnd: Optional[str] = None
    retrievalTime: str
    spatialResolution: str = "0.1 degree (~10 km)"
    fieldId: str
    spatialMethod: str = "point_nearest_neighbor"
    qualityStatus: Optional[str] = None
    cacheStatus: str = "fresh"
    explanation: Optional[str] = None
    dailySamples: List[GpmPointSample] = Field(default_factory=list)
