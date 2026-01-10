export default function Maps() {
  return (
    <div className="h-full w-full p-4">
      <h1 className="text-2xl font-semibold mb-4">Ward-wise AQI Heatmap</h1>

      <iframe
        src="/delhi_ward_aqi_map.html"
        title="Delhi AQI Map"
        className="w-full h-[80vh] rounded-lg border"
      />
    </div>
  );
}
