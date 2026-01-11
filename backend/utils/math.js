export function clamp(value, min, max) {
    if (typeof value !== "number") return min;
    return Math.min(Math.max(value, min), max);
  }
  
  export function percentChange(current, previous) {
    if (
      typeof current !== "number" ||
      typeof previous !== "number" ||
      previous === 0
    ) {
      return 0;
    }
    return ((current - previous) / previous) * 100;
  }
  
  export function normalizeToPercentages(scores) {
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
  
    if (total === 0) {
      return Object.keys(scores).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {});
    }
  
    const percentages = {};
    let runningTotal = 0;
    let maxKey = null;
  
    for (const [key, value] of Object.entries(scores)) {
      percentages[key] = Math.round((value / total) * 100);
      runningTotal += percentages[key];
  
      if (!maxKey || percentages[key] > percentages[maxKey]) {
        maxKey = key;
      }
    }
  
    const drift = 100 - runningTotal;
    if (drift !== 0 && maxKey) {
      percentages[maxKey] += drift;
    }
  
    return percentages;
  }
  
  export function average(values = []) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + (Number(b) || 0), 0);
    return sum / values.length;
  }
  
  export function safeDivide(a, b) {
    if (typeof a !== "number" || typeof b !== "number" || b === 0) {
      return 0;
    }
    return a / b;
  }
  
  
  export function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
  
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return Number((R * c).toFixed(2));
  }
  