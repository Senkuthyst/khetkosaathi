from typing import Optional, List
from pydantic import BaseModel, Field

class HlsSceneInfo(BaseModel):
    id: str
    collection: str  # "HLSS30_2.0" or "HLSL30_2.0"
    sensor: str      # "Sentinel-2" or "Landsat-8/9"
    datetime: str
    cloud_cover: float
    nir_band: str    # "B08" (S30) or "B05" (L30)
    red_band: str    # "B04"
    nir_asset_url: Optional[str] = None
    red_asset_url: Optional[str] = None
    fmask_asset_url: Optional[str] = None

class HlsNdviObservation(BaseModel):
    scene_id: str
    collection: str
    sensor: str
    date: str
    cloud_cover: float
    ndvi: Optional[float] = None
    fmask_valid: bool = True
    fmask_description: str = "Clear Land"
    nir_value: Optional[float] = None
    red_value: Optional[float] = None

class HlsVegetationResponse(BaseModel):
    source: str = "NASA HLS (HLSS30 / HLSL30)"
    spatialResolution: str = "30 m"
    fieldId: str
    latitude: float
    longitude: float
    status: str  # "AVAILABLE", "NO_CLEAR_SCENES", "ERROR", "AUTHENTICATION_REQUIRED"
    currentYearObservation: Optional[HlsNdviObservation] = None
    lastYearObservation: Optional[HlsNdviObservation] = None
    ndviDelta: Optional[float] = None
    ndviDeltaPct: Optional[float] = None
    retrievalTime: str
    explanation: Optional[str] = None
