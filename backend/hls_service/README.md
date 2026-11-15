# KHETKOSAATHI NASA HLS Vegetation Microservice

FastAPI microservice for **NASA Harmonized Landsat Sentinel-2 (HLS)** 30-meter vegetation index (NDVI) extraction and year-over-year comparison.

## Data Sources
- **HLSS30.v2.0**: Sentinel-2 Multi-Spectral Instrument (30m equivalent, Red = B04, NIR = B08, Cloud Mask = Fmask).
- **HLSL30.v2.0**: Landsat-8/9 Operational Land Imager (30m, Red = B04, NIR = B05, Cloud Mask = Fmask).
- **CMR STAC**: `https://cmr.earthdata.nasa.gov/stac/LPCLOUD/search`

## Features
1. **Windowed Reads**: Reads only a small pixel window around the farm centroid via HTTP Range requests / GDAL/Rasterio without downloading 300MB scenes.
2. **Quality Masking**: Fmask bitmask decoding (filters cloud, cloud shadow, snow/ice, water).
3. **Cloud Cutoff**: Strictly filters to scenes with $\le 20\%$ scene cloud cover (`eo:cloud_cover`).
4. **Year-Over-Year**: Automatically compares this year's observation against the same seasonal window last year.

## Running Locally

```bash
cd backend/hls_service
python -m venv venv
.\venv\Scripts\activate   # On Windows
pip install -r requirements.txt
uvicorn backend.hls_service.main:app --port 8001 --reload
```
