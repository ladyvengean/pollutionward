from fastapi import FastAPI
import geopandas as gpd
import json
from datetime import datetime

app = FastAPI(title="Delhi Ward AQI API")

WARD_FILE = "data/delhi_wards.geojson"

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/ward-aqi")
def ward_aqi():
    gdf = gpd.read_file("data/final_ward_aqi.geojson")

    return {
        "timestamp": datetime.utcnow().isoformat(),
        "type": "FeatureCollection",
        "features": json.loads(gdf.to_json())["features"]
    }
