import requests
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
import os
os.makedirs("data", exist_ok=True)  # ensures the 'data' folder exists

TOKEN = "44167277617e21600a6dda0c0cfa6ea65c27260c"

url = "https://api.waqi.info/map/bounds/"

# Delhi bounding box (safe coverage)
params = {
    "latlng": "28.40,76.80,28.90,77.40",
    "token": TOKEN
}

response = requests.get(url, params=params)
data = response.json()

assert data["status"] == "ok", data

stations = data["data"]

print("Stations fetched:", len(stations))

records = []

for s in stations:
    if s["aqi"] == "-" or s["aqi"] is None:
        continue

    records.append({
        "station_name": s["station"]["name"],
        "lat": s["lat"],
        "lon": s["lon"],
        "aqi": int(s["aqi"])
    })

df = pd.DataFrame(records)
print(df.head())

gdf_stations = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df.lon, df.lat),
    crs="EPSG:4326"
)

print(gdf_stations.crs)
print(gdf_stations.head())

# Save GeoDataFrame to disk for mapping
gdf_stations.to_file("data/waqi_stations.geojson", driver="GeoJSON")
print("Saved: data/waqi_stations.geojson")

