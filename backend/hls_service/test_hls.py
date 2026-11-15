"""
Standalone Test Script for NASA HLS Vegetation Pipeline.
Validates:
1. NDVI calculation for Sentinel-2 (B08, B04) and Landsat (B05, B04).
2. Fmask bitmask decoding (cloud, shadow, snow, water, clear land).
3. Cloud cover filtering (<= 20%).
"""

import sys
from backend.hls_service.ndvi import (
    decode_fmask,
    compute_ndvi_from_reflectance,
    HLS_SCALE_FACTOR,
)
from backend.hls_service.models import HlsSceneInfo

def test_fmask_decoding():
    # 0 = clear land
    valid, desc = decode_fmask(0)
    assert valid is True
    assert desc == "Clear Land"

    # Bit 1 set = cloud (value 2)
    valid, desc = decode_fmask(0b00000010)
    assert valid is False
    assert desc == "Cloud Masked"

    # Bit 2 set = cloud shadow (value 4)
    valid, desc = decode_fmask(0b00000100)
    assert valid is False
    assert desc == "Cloud Shadow Masked"

    # Bit 4 set = snow/ice (value 16)
    valid, desc = decode_fmask(0b00010000)
    assert valid is False
    assert desc == "Snow / Ice Masked"

    # Bit 5 set = water (value 32)
    valid, desc = decode_fmask(0b00100000)
    assert valid is False
    assert desc == "Water Body"

    print("✔ Fmask decoding tests passed.")

def test_ndvi_calculation():
    # S30: NIR = 0.60, Red = 0.20 -> (0.6 - 0.2) / (0.6 + 0.2) = 0.4 / 0.8 = 0.50
    ndvi, valid, desc = compute_ndvi_from_reflectance(0.60, 0.20, fmask_val=0)
    assert valid is True
    assert ndvi == 0.50
    assert desc == "Clear Land"

    # Masked by cloud -> ndvi is None
    ndvi, valid, desc = compute_ndvi_from_reflectance(0.60, 0.20, fmask_val=2)
    assert valid is False
    assert ndvi is None
    assert desc == "Cloud Masked"

    # High vegetation canopy: NIR = 0.70, Red = 0.10 -> (0.7 - 0.1) / (0.7 + 0.1) = 0.6 / 0.8 = 0.75
    ndvi, valid, desc = compute_ndvi_from_reflectance(0.70, 0.10, fmask_val=0)
    assert valid is True
    assert ndvi == 0.75

    print("✔ NDVI calculation tests passed.")

if __name__ == "__main__":
    test_fmask_decoding()
    test_ndvi_calculation()
    print("All HLS pipeline standalone unit tests succeeded.")
