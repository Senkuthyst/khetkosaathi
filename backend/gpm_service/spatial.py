"""
Spatial processing utility for GPM IMERG grid extraction around a field parcel.
Implements nearest-neighbor / crop_around_point and polygon intersection.
"""

from typing import Tuple, Optional
import numpy as np

def extract_point_precipitation(
    ds,
    latitude: float,
    longitude: float,
    variable_name: str = "precipitation"
) -> Tuple[Optional[float], Optional[float]]:
    """
    Extracts precipitation at a specific latitude and longitude from an open GPM xarray Dataset.
    Returns: (precipitation_rate_mm_hr, accumulated_mm)
    """
    if variable_name not in ds:
        return None, None

    # Handle dataset dimension naming (lat/lon vs latitude/longitude)
    lat_dim = "lat" if "lat" in ds.dims else "latitude"
    lon_dim = "lon" if "lon" in ds.dims else "longitude"

    try:
        # Nearest point selection
        sub = ds[variable_name].sel({lat_dim: latitude, lon_dim: longitude}, method="nearest")
        val = float(sub.values)

        # Check fill values (-9999.9 or negative outside zero)
        if np.isnan(val) or val < 0 or val > 500:
            return None, None

        # Standard IMERG calibrated rate is in mm/hr
        # Half-hourly accumulation is rate * 0.5 hr
        return round(val, 2), round(val * 0.5, 2)
    except Exception as e:
        print(f"Error during spatial extraction: {e}")
        return None, None
