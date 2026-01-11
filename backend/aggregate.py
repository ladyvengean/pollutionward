import geopandas as gpd
import pandas as pd

# Load wards
wards = gpd.read_file("data/delhi_wards.geojson")

# Load Delhi stations from previous step
stations = gpd.read_file("data/waqi_stations.geojson")

# Ensure CRS match
stations = stations.to_crs(wards.crs)

# Spatial join to assign stations to wards
stations_in_delhi = gpd.sjoin(
    stations, wards,
    how="inner",
    predicate="within"
)

# Aggregate AQI for wards with stations
ward_aqi = (
    stations_in_delhi
    .groupby(["Ward_No", "Ward_Name"])
    .agg(
        avg_aqi=("aqi", "mean"),
        max_aqi=("aqi", "max"),
        station_count=("aqi", "count")
    )
    .reset_index()
)

# Identify wards without stations
missing_wards = wards[~wards["Ward_No"].isin(ward_aqi["Ward_No"])]

# Fill missing wards with nearest-station AQI
from shapely.ops import nearest_points

def nearest_station_aqi(ward_geom, stations):
    centroid = ward_geom.centroid
    distances = stations.geometry.distance(centroid)
    idx = distances.idxmin()
    return stations.loc[idx, "aqi"]

estimated = []
for _, ward in missing_wards.iterrows():
    aqi = nearest_station_aqi(ward.geometry, stations_in_delhi)
    estimated.append({
        "Ward_No": ward["Ward_No"],
        "Ward_Name": ward["Ward_Name"],
        "avg_aqi": aqi,
        "max_aqi": aqi,
        "station_count": 0
    })

estimated_df = pd.DataFrame(estimated)

# Combine both
final_ward_aqi = pd.concat([ward_aqi, estimated_df], ignore_index=True)

# Merge with ward geometries for mapping
final_ward_gdf = wards.merge(final_ward_aqi, on=["Ward_No", "Ward_Name"], how="left")

# Save final result
final_ward_gdf.to_file("data/final_ward_aqi.geojson", driver="GeoJSON")
print("Saved final ward-wise AQI for all wards!")