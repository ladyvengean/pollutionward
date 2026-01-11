
export function generatePublicAdvisory({
    pollution,
    weather,
    triggers,
    confidence
  }) {
    if (!pollution || !weather) {
      throw new Error("Missing data for public advisory evaluation");
    }
  
    const { pm25 = 0 } = pollution;
    const { windSpeed = 0 } = weather;
  
    let advisory = null;
    let advisoryLevel = "None";
  
    const PM25_MODERATE = Number(process.env.PM25_MODERATE);
    const PM25_POOR = Number(process.env.PM25_POOR);
    const PM25_SEVERE = Number(process.env.PM25_SEVERE);
  
    const isWeatherTrapped = windSpeed <= Number(process.env.LOW_WIND_THRESHOLD);

    if (pm25 >= PM25_MODERATE && pm25 < PM25_POOR) {
      advisory = 
        "Air quality is moderately affected. Individuals with respiratory conditions should take precautions.";
      advisoryLevel = "Moderate";
    }
  
    
    if (
      pm25 >= PM25_POOR &&
      (isWeatherTrapped || triggers?.pm25Spike)
    ) {
      advisory =
        "Air quality is poor. Children, elderly, and individuals with respiratory conditions should limit prolonged outdoor activity.";
      advisoryLevel = "Poor";
    }
  

    if (
      pm25 >= PM25_SEVERE &&
      isWeatherTrapped &&
      confidence === "High"
    ) {
      advisory =
        "Air quality is severely affected. General public is advised to avoid outdoor activities and follow health advisories issued by authorities.";
      advisoryLevel = "Severe";
    }
  
 
    if (!advisory) {
      return {
        advisoryIssued: false,
        advisoryLevel: "None"
      };
    }
  
    return {
      advisoryIssued: true,
      advisoryLevel,
      advisory
    };
  }
  