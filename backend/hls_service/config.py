import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    NASA_EARTHDATA_TOKEN: str = os.getenv("NASA_EARTHDATA_TOKEN", "")
    HLS_SERVICE_PORT: int = int(os.getenv("HLS_SERVICE_PORT", "8001"))
    HLS_CMR_STAC_URL: str = os.getenv(
        "HLS_CMR_STAC_URL", "https://cmr.earthdata.nasa.gov/stac/LPCLOUD/search"
    )
    MAX_CLOUD_COVER: float = float(os.getenv("HLS_MAX_CLOUD_COVER", "20.0"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
