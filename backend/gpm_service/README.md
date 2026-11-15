# KHETKOSAATHI NASA GPM-API Python Microservice

This microservice uses the official NASA GPM-API (`gpm-api`) and `xarray` to download, subset, and extract precipitation observations from **NASA GPM IMERG-LR (Late Run) Version 07B** Near-Real-Time products.

## Installation

```bash
cd backend/gpm_service
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

## Configuration

Set the following environment variables in `.env`:

```env
NASA_EARTHDATA_TOKEN="your_earthdata_token"
NASA_PPS_USER="your_registered_email_for_pps"
GPM_SERVICE_PORT=8000
```

*Note: Register for free at [NASA PPS (Precipitation Processing System)](https://registration.pps.eosdis.nasa.gov/registration/) to enable NRT product downloads.*

## Running the Service

```bash
uvicorn backend.gpm_service.main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoint

`GET http://localhost:8000/api/earth/gpm/imerg?fieldId=plot-1&latitude=27.6775&longitude=84.4333&days=7`
