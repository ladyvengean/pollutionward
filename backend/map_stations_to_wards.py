import geopandas as gpd
import pandas as pd

wards = gpd.read_file("data/delhi_wards.geojson")
stations = gpd.read_file("data/waqi_stations.geojson")

stations_delhi = gpd.sjoin(
    stations,
    wards,
    how="inner",
    predicate="within"
)

print("Stations in Delhi:", len(stations_delhi))
print(stations_delhi["station_name"])

stations_delhi = stations_delhi[[
    "station_name",
    "aqi",
    "Ward_No",
    "Ward_Name",
    "geometry"
]]

# print(stations_delhi.head())
