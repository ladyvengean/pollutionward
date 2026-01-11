export function generateExplanation({ ward, station, category }) {
    if (!ward || !station || !category) {
      throw new Error("Missing data for explanation generation");
    }
  
    const stationName = station.name || "nearest AQICN monitoring station";
    const distanceKm = station.distance || "unknown";
  
    let explanation = `Air quality in ${ward.name} is currently classified as ${category}. `;
  
    explanation += `This assessment is based on readings from the nearest certified monitoring station (${stationName}), located approximately ${distanceKm} km from the ward. `;
  
    if (ward.zone === "Industrial") {
      explanation +=
        "The presence of industrial activity in this area may be contributing to elevated pollution levels. ";
    } else if (ward.zone === "Residential") {
      explanation +=
        "Residential emissions and nearby traffic movement may be influencing air quality. ";
    } else if (ward.zone === "Commercial") {
      explanation +=
        "Commercial activity and traffic density in this area may be impacting air quality. ";
    }
  
  
  
    if (station.weatherImpact?.poorDispersion) {
      explanation +=
        "Low wind speeds are currently limiting the dispersion of pollutants, causing accumulation. ";
    }
  
    if (station.weatherImpact?.highHumidity) {
      explanation +=
        "High humidity levels may be contributing to increased particulate formation and persistence. ";
    }
  
    explanation +=
      "Residents are advised to follow recommended precautions until conditions improve.";
  
    return explanation;
  }
  