import axios from "axios";

export async function getTrafficForWard(lat, lon) {
  try {
    const response = await axios.get(
      "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json",
      {
        params: {
          key: process.env.TOMTOM_API_KEY,
          point: `${lat},${lon}`,
          unit: "KMPH"
        },
        timeout: 8000
      }
    );

    const data = response.data.flowSegmentData;

    if (!data?.currentSpeed || !data?.freeFlowSpeed) {
      return null;
    }

    return {
      currentSpeed: data.currentSpeed,
      freeFlowSpeed: data.freeFlowSpeed,
      confidence: data.confidence
    };
  } catch (err) {
    console.warn("[Traffic] Unavailable:", err.message);
    return null; 
  }
}
