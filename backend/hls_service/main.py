"""
FastAPI Microservice for NASA HLS (Harmonized Landsat Sentinel-2) NDVI.
Exposes GET /api/earth/hls/vegetation to compute 30m NDVI and compare this year vs last year.
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional

from .config import settings
from .models import HlsVegetationResponse, HlsNdviObservation
from .stac import search_hls_scenes
from .ndvi import extract_scene_ndvi_window

app = FastAPI(
    title="KHETKOSAATHI NASA HLS Vegetation Service",
    description="30m Harmonized Landsat Sentinel-2 (HLS) NDVI extraction & year-over-year comparison microservice.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "hls_service", "resolution": "30m"}

@app.get("/api/earth/hls/vegetation", response_model=HlsVegetationResponse)
def get_hls_vegetation(
    fieldId: str = Query(..., description="Field identifier"),
    latitude: float = Query(..., ge=-90, le=90, description="Field centroid latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Field centroid longitude"),
    windowDays: int = Query(30, ge=7, le=90, description="Search window in days back from today"),
):
    """
    Search HLS (HLSS30 & HLSL30) scenes <= 20% cloud cover.
    Extracts NDVI for the target field in the current year and for the exact same date window last year.
    """
    retrieval_time = datetime.utcnow().isoformat() + "Z"
    now = datetime.utcnow()

    # 1. Date window for Current Year
    curr_end = now
    curr_start = curr_end - timedelta(days=windowDays)
    curr_start_str = curr_start.strftime("%Y-%m-%d")
    curr_end_str = curr_end.strftime("%Y-%m-%d")

    # 2. Same Date window for Last Year
    last_end = now.replace(year=now.year - 1)
    last_start = last_end - timedelta(days=windowDays)
    last_start_str = last_start.strftime("%Y-%m-%d")
    last_end_str = last_end.strftime("%Y-%m-%d")

    # Search current year scenes (cloud <= 20%)
    curr_scenes = search_hls_scenes(latitude, longitude, curr_start_str, curr_end_str)
    # Search last year scenes (cloud <= 20%)
    last_scenes = search_hls_scenes(latitude, longitude, last_start_str, last_end_str)

    curr_obs: Optional[HlsNdviObservation] = None
    last_obs: Optional[HlsNdviObservation] = None

    if curr_scenes:
        curr_obs = extract_scene_ndvi_window(curr_scenes[0], latitude, longitude)

    if last_scenes:
        last_obs = extract_scene_ndvi_window(last_scenes[0], latitude, longitude)

    # Compute year-over-year delta if both observations have valid NDVI
    delta: Optional[float] = None
    delta_pct: Optional[float] = None

    if curr_obs and curr_obs.ndvi is not None and last_obs and last_obs.ndvi is not None:
        delta = round(curr_obs.ndvi - last_obs.ndvi, 4)
        if last_obs.ndvi > 0:
            delta_pct = round((delta / last_obs.ndvi) * 100.0, 1)

    status = "AVAILABLE" if (curr_obs and curr_obs.ndvi is not None) else (
        "NO_CLEAR_SCENES" if not curr_scenes else "SCENE_DISCOVERED_PENDING_DOWNLOAD"
    )

    explanation = None
    if not curr_scenes:
        explanation = f"No clear HLS scene (cloud cover <= {settings.MAX_CLOUD_COVER}%) found in the past {windowDays} days."
    elif curr_obs and curr_obs.ndvi is not None:
        explanation = f"Observed 30m NDVI {curr_obs.ndvi} via {curr_obs.sensor} ({curr_obs.collection})."

    return HlsVegetationResponse(
        fieldId=fieldId,
        latitude=latitude,
        longitude=longitude,
        status=status,
        currentYearObservation=curr_obs,
        lastYearObservation=last_obs,
        ndviDelta=delta,
        ndviDeltaPct=delta_pct,
        retrievalTime=retrieval_time,
        explanation=explanation,
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.hls_service.main:app", host="0.0.0.0", port=settings.HLS_SERVICE_PORT, reload=True)
