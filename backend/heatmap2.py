import folium
import json
import logging
from branca.colormap import linear

# Setup logging
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

GEOJSON_FILE = "data/final_ward_aqi.geojson"
OUTPUT_HTML = "delhi_ward_aqi_map.html"

# Load GeoJSON
try:
    with open(GEOJSON_FILE, "r", encoding="utf-8") as f:
        wards_geojson = json.load(f)
    logging.info(f"Loaded GeoJSON: {GEOJSON_FILE}")
except Exception as e:
    logging.error(f"Failed to load GeoJSON: {e}")
    exit()

# Check properties
if 'features' in wards_geojson and len(wards_geojson['features']) > 0:
    sample_props = wards_geojson['features'][0]['properties']
    logging.info(f"Properties in GeoJSON: {list(sample_props.keys())}")
else:
    logging.error("GeoJSON has no features!")
    exit()

# Create map
m = folium.Map(location=[28.6139, 77.2090], zoom_start=11)

# AQI colormap
aqi_values = [f['properties']['avg_aqi'] for f in wards_geojson['features']]
min_aqi, max_aqi = min(aqi_values), max(aqi_values)
colormap = linear.YlOrRd_09.scale(min_aqi, max_aqi)
colormap.caption = "Average AQI"
colormap.add_to(m)

# Style function
def style_function(feature):
    aqi = feature['properties'].get('avg_aqi', 0)
    return {
        'fillOpacity': 0.7,
        'weight': 0.5,
        'color': 'black',
        'fillColor': colormap(aqi)
    }

# Popup function
def popup_function(feature):
    props = feature['properties']
    html = f"""
    <b>Ward:</b> {props.get('Ward_Name', 'N/A')}<br>
    <b>Ward No:</b> {props.get('Ward_No', 'N/A')}<br>
    <b>Average AQI:</b> {props.get('avg_aqi', 'N/A')}<br>
    <b>Max AQI:</b> {props.get('max_aqi', 'N/A')}<br>
    <b>Station Count:</b> {props.get('station_count', 'N/A')}
    """
    return folium.Popup(html, max_width=300)

# Add wards to map
folium.GeoJson(
    wards_geojson,
    style_function=style_function,
    tooltip=folium.GeoJsonTooltip(
        fields=['Ward_Name', 'avg_aqi'],
        aliases=['Ward:', 'Average AQI:'],
        localize=True
    ),
    popup=popup_function
).add_to(m)

# Save map
try:
    m.save(OUTPUT_HTML)
    logging.info(f"Map saved: {OUTPUT_HTML}")
except Exception as e:
    logging.error(f"Failed to save map: {e}")
