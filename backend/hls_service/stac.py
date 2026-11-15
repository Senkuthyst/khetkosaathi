"""
CMR STAC Search Client for NASA Harmonized Landsat Sentinel-2 (HLS).
Searches HLSS30.v2.0 and HLSL30.v2.0 collections over a point and date window.
Filters scenes strictly to cloud cover <= 20%.
"""

from typing import List, Optional, Tuple
import requests
from datetime import datetime
from .config import settings
from .models import HlsSceneInfo

def search_hls_scenes(
    latitude: float,
    longitude: float,
    start_date: str,
    end_date: str,
    max_cloud_cover: float = settings.MAX_CLOUD_COVER,
) -> List[HlsSceneInfo]:
    """
    Query CMR STAC for HLS scenes covering the coordinate within the date range.
    Only scenes with cloud cover <= max_cloud_cover are returned, sorted newest to oldest.
    """
    # Create small bounding box around point (~0.01 deg is approx 1 km)
    delta = 0.01
    bbox = [longitude - delta, latitude - delta, longitude + delta, latitude + delta]

    payload = {
        "collections": ["HLSS30.v2.0", "HLSL30.v2.0"],
        "bbox": bbox,
        "datetime": f"{start_date}T00:00:00Z/{end_date}T23:59:59Z",
        "limit": 20,
    }

    headers = {"Content-Type": "application/json"}
    if settings.NASA_EARTHDATA_TOKEN:
        headers["Authorization"] = f"Bearer {settings.NASA_EARTHDATA_TOKEN}"

    try:
        res = requests.post(
            settings.HLS_CMR_STAC_URL,
            json=payload,
            headers=headers,
            timeout=12,
        )
        if res.status_code != 200:
            print(f"CMR STAC returned HTTP {res.status_code}: {res.text[:200]}")
            return []

        data = res.json()
        features = data.get("features", [])
        scenes: List[HlsSceneInfo] = []

        for feat in features:
            props = feat.get("properties", {})
            cloud_cover = float(props.get("eo:cloud_cover", 100.0))

            if cloud_cover > max_cloud_cover:
                continue

            feat_id = feat.get("id", "")
            collection = feat.get("collection", "")
            dt_str = props.get("datetime", "")

            # Band determination:
            # Sentinel-2 (S30): NIR = B08, Red = B04
            # Landsat-8/9 (L30): NIR = B05, Red = B04
            is_s30 = "S30" in feat_id or "S30" in collection
            sensor = "Sentinel-2" if is_s30 else "Landsat-8/9"
            nir_band = "B08" if is_s30 else "B05"
            red_band = "B04"

            assets = feat.get("assets", {})
            nir_asset = assets.get(nir_band, {}).get("href")
            red_asset = assets.get(red_band, {}).get("href")
            fmask_asset = assets.get("Fmask", {}).get("href")

            scenes.append(
                HlsSceneInfo(
                    id=feat_id,
                    collection=collection,
                    sensor=sensor,
                    datetime=dt_str,
                    cloud_cover=round(cloud_cover, 2),
                    nir_band=nir_band,
                    red_band=red_band,
                    nir_asset_url=nir_asset,
                    red_asset_url=red_asset,
                    fmask_asset_url=fmask_asset,
                )
            )

        # Sort newest first, then lowest cloud cover
        scenes.sort(key=lambda s: (s.datetime, -s.cloud_cover), reverse=True)
        return scenes

    except Exception as e:
        print(f"Error querying CMR STAC for HLS: {e}")
        return []
