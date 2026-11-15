"""
FastAPI Server for GPM-API IMERG Processing Microservice.
Exposes GET /api/earth/gpm/imerg to the frontend application.
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .imerg import process_imerg_lr
from .models import GpmImergResponse

app = FastAPI(
    title="KHETKOSAATHI NASA GPM IMERG Service",
    description="Python microservice wrapping NASA GPM-API for IMERG-LR V07B precipitation extraction.",
    version="1.0.0"
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
    return {"status": "ok", "service": "gpm_service"}

@app.get("/api/earth/gpm/imerg", response_model=GpmImergResponse)
def get_gpm_imerg(
    fieldId: str = Query(..., description="ID of the selected farm"),
    latitude: float = Query(..., ge=-90, le=90, description="Farm centroid latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Farm centroid longitude"),
    days: int = Query(7, ge=1, le=30, description="Days of accumulation")
):
    """
    Retrieve and process NASA GPM IMERG-LR V07B precipitation for the given coordinates.
    """
    result = process_imerg_lr(
        field_id=fieldId,
        latitude=latitude,
        longitude=longitude,
        days=days
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.gpm_service.main:app", host="0.0.0.0", port=settings.SERVICE_PORT, reload=True)
