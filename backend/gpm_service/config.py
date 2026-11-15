import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    NASA_EARTHDATA_TOKEN: str = os.getenv("NASA_EARTHDATA_TOKEN", "")
    NASA_EARTHDATA_USERNAME: str = os.getenv("NASA_EARTHDATA_USERNAME", "")
    NASA_EARTHDATA_PASSWORD: str = os.getenv("NASA_EARTHDATA_PASSWORD", "")
    NASA_PPS_USER: str = os.getenv("NASA_PPS_USER", "")
    GPM_DOWNLOAD_DIR: str = os.getenv("GPM_DOWNLOAD_DIR", "./gpm_cache")
    SERVICE_PORT: int = int(os.getenv("GPM_SERVICE_PORT", "8000"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
