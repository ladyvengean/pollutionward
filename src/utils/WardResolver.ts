import { point, booleanPointInPolygon } from "@turf/turf";
import type { Feature, Polygon, MultiPolygon } from "geojson";

export interface Ward {
  wardId: string;
  name: string;
  polygon: Polygon | MultiPolygon;
}

/**
 * Fetches the Delhi wards GeoJSON from the public folder
 */
async function fetchWardsGeoJson(): Promise<GeoJSON.FeatureCollection<Polygon | MultiPolygon>> {
  const response = await fetch("/Delhi_Wards.geojson"); // public folder path
  if (!response.ok) throw new Error("Failed to load wards GeoJSON");
  return response.json();
}

/**
 * Given latitude and longitude, returns the ward containing that point
 */
export async function resolveWardFromLatLng(
  lat: number,
  lng: number
): Promise<Ward | null> {
  try {
    const wardsGeoJson = await fetchWardsGeoJson();
    const userPoint = point([lng, lat]); // GeoJSON uses [lng, lat]

    for (const feature of wardsGeoJson.features) {
      if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
        const polygonFeature = feature as Feature<Polygon | MultiPolygon, any>;

        if (booleanPointInPolygon(userPoint, polygonFeature)) {
          return {
            wardId: feature.properties.WARD_ID || feature.properties.id,
            name: feature.properties.WARD_NAME || feature.properties.name,
            polygon: feature.geometry as Polygon | MultiPolygon,
          };
        }
      }
    }

    // No matching ward found
    return null;
  } catch (err) {
    console.error("Error resolving ward:", err);
    return null;
  }
}
