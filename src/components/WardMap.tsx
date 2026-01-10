// import { MapContainer, TileLayer } from "react-leaflet";

// const WardMap = () => {
//   return (
//     <MapContainer
//       center={[28.6448, 77.2167]} // any city center
//       zoom={14}
//       style={{ height: "100vh", width: "100%" }}
//     >
//       <TileLayer
//         attribution='&copy; OpenStreetMap'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//     </MapContainer>
//   );
// };

// export default WardMap;

// 
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useState } from "react";
import { wards } from "../data/wards";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

type PollutionData = {
  pm25: number | null;
  pm10: number | null;
  aqi: number | null;
  city?: string;
  source: string;
};

const WardMap = () => {
  const [pollutionData, setPollutionData] = useState<Record<string | number, PollutionData>>({});
  const [loadingWardId, setLoadingWardId] = useState<string | number | null>(null);

  const fetchPollution = async (wardId: string | number, lat: number, lon: number) => {
    setLoadingWardId(wardId);

    try {
      const res = await fetch(
        `http://localhost:5000/api/pollution?lat=${lat}&lon=${lon}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setPollutionData((prev) => ({
        ...prev,
        [wardId]: data,
      }));
    } catch (err) {
      console.error("Failed to fetch pollution data", err);
      alert("Failed to fetch pollution data. Please check if backend is running.");
    } finally {
      setLoadingWardId(null);
    }
  };

  const getAQIColor = (aqi?: number | null) => {
    if (!aqi) return "#81c784"; // light green
    if (aqi <= 50) return "#00e400";
    if (aqi <= 100) return "#ffff00";
    if (aqi <= 200) return "#ff7e00";
    if (aqi <= 300) return "#ff0000";
    return "#8f3f97";
  };

  return (
    <MapContainer
      center={[28.6448, 77.2167]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {wards.map((ward) => {
        const data = pollutionData[ward.id];

        return (
          <CircleMarker
            key={ward.id}
            center={ward.center}
            radius={15}
            pathOptions={{
              color: "#1b5e20",
              fillColor: getAQIColor(data?.aqi),
              fillOpacity: 0.8,
            }}
            eventHandlers={{
              click: () =>
                fetchPollution(
                  ward.id,
                  ward.center[0],
                  ward.center[1]
                ),
            }}
          >
            <Popup>
              <strong>{pollutionData[ward.id]?.city || ward.name}</strong>
              <br />

              {loadingWardId === ward.id && <p>Loading...</p>}

              {data && (
                <>
                  <p>AQI: {data.aqi}</p>
                  <p>PM2.5: {data.pm25}</p>
                  <p>PM10: {data.pm10}</p>
                  <p style={{ fontSize: "12px", color: "#555" }}>
                    Source: {data.source}
                  </p>
                </>
              )}

              {!data && loadingWardId !== ward.id && (
                <p>Click to load pollution data</p>
              )}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default WardMap;