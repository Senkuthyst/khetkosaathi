"""
Authentication helper for NASA Earthdata and NASA PPS for GPM-API.
Follows the official GPM-API credential specification:
- Earthdata bearer token configured in gpm configuration / environment.
- PPS registration for Near-Real-Time (NRT) products (IMERG-ER / IMERG-LR).
"""

import os
from .config import settings

def configure_gpm_auth():
    """
    Configures GPM-API environment credentials.
    GPM-API respects:
    - EARTH_DATA_BEARER_TOKEN or NASA_EARTHDATA_TOKEN
    - EARTH_DATA_USERNAME / EARTH_DATA_PASSWORD
    - GPM_PPS_USER
    """
    if settings.NASA_EARTHDATA_TOKEN:
        os.environ["EARTH_DATA_BEARER_TOKEN"] = settings.NASA_EARTHDATA_TOKEN
        os.environ["NASA_EARTHDATA_TOKEN"] = settings.NASA_EARTHDATA_TOKEN

    if settings.NASA_EARTHDATA_USERNAME:
        os.environ["EARTH_DATA_USERNAME"] = settings.NASA_EARTHDATA_USERNAME

    if settings.NASA_EARTHDATA_PASSWORD:
        os.environ["EARTH_DATA_PASSWORD"] = settings.NASA_EARTHDATA_PASSWORD

    if settings.NASA_PPS_USER:
        os.environ["GPM_PPS_USER"] = settings.NASA_PPS_USER
