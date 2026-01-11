
export function getConfidenceScore({ source, distance }) {
    let score = 1.0;
  
  
    switch (source) {
      case "CPCB":
        score *= 0.95; // authoritative govt data
        break;
      case "AQICN":
        score *= 0.85; // secondary aggregated source
        break;
      default:
        score *= 0.7;
    }
  
  
    if (distance > 10) {
      score *= 0.7;
    } else if (distance > 5) {
      score *= 0.8;
    } else if (distance > 2) {
      score *= 0.9;
    }
  
  
    score = Math.max(0.4, Math.min(score, 0.95));
  
    return Number(score.toFixed(2));
  }
  