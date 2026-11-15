"""
GPM IMERG-LR V07B Data Access Workflow.
Follows the official NASA GPM-API tutorial:
1. gpm.available_products(product_categories="IMERG", product_types="NRT")
2. gpm.download(product="IMERG-LR", product_type="NRT", version=7, ...)
3. ds = gpm.open_dataset(product="IMERG-LR", product_type="NRT", version=7, ...)
4. Extract ds["precipitation"]
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from .auth import configure_gpm_auth
from .spatial import extract_point_precipitation
from .models import GpmImergResponse, GpmPointSample

def process_imerg_lr(
    field_id: str,
    latitude: float,
    longitude: float,
    days: int = 7
) -> GpmImergResponse:
    configure_gpm_auth()

    retrieval_time = datetime.utcnow().isoformat() + "Z"
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    try:
        import gpm

        # 1. Check available products
        nrt_products = gpm.available_products(
            product_categories="IMERG",
            product_types="NRT"
        )
        if "IMERG-LR" not in nrt_products:
            return GpmImergResponse(
                status="PRODUCT_NOT_AVAILABLE",
                fieldId=field_id,
                retrievalTime=retrieval_time,
                explanation="IMERG-LR not found in available GPM NRT products."
            )

        # 2. Download granules for the time range (IMERG-LR V07 NRT)
        gpm.download(
            product="IMERG-LR",
            product_type="NRT",
            version=7,
            start_time=start_date.strftime("%Y-%m-%d %H:%M:%S"),
            end_time=end_date.strftime("%Y-%m-%d %H:%M:%S"),
            storage="PPS",
            force_download=False,
            verbose=False,
            progress_bar=False
        )

        # 3. Open dataset
        ds = gpm.open_dataset(
            product="IMERG-LR",
            product_type="NRT",
            version=7,
            start_time=start_date.strftime("%Y-%m-%d %H:%M:%S"),
            end_time=end_date.strftime("%Y-%m-%d %H:%M:%S")
        )

        # 4. Extract precipitation variable
        rate, acc = extract_point_precipitation(ds, latitude, longitude, "precipitation")

        return GpmImergResponse(
            status="AVAILABLE" if acc is not None else "MISSING",
            precipitation=acc,
            observationStart=start_date.strftime("%Y-%m-%d"),
            observationEnd=end_date.strftime("%Y-%m-%d"),
            retrievalTime=retrieval_time,
            fieldId=field_id,
            qualityStatus="good" if acc is not None else "missing",
            explanation=f"Successfully extracted {acc} mm from IMERG-LR V07B dataset." if acc is not None else "Point extracted fill value."
        )

    except ImportError:
        return GpmImergResponse(
            status="GPM_API_NOT_INSTALLED",
            fieldId=field_id,
            retrievalTime=retrieval_time,
            explanation="gpm-api python library is not installed in the host environment. Run 'pip install gpm-api xarray'."
        )
    except Exception as e:
        err_msg = str(e)
        status = "AUTHENTICATION_REQUIRED" if "credentials" in err_msg.lower() or "pps" in err_msg.lower() else "DOWNLOAD_FAILED"
        return GpmImergResponse(
            status=status,
            fieldId=field_id,
            retrievalTime=retrieval_time,
            explanation=f"GPM-API execution error: {err_msg}"
        )
