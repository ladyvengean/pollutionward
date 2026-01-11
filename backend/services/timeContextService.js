

/**
 * Derives time-based context from a timestamp
 * @param {string | Date} timestamp
 */
export function getTimeContext(timestamp = new Date()) {
    const date = new Date(timestamp);
  
    if (isNaN(date.getTime())) {
      throw new Error("Invalid timestamp for time context");
    }
  
    const hour = date.getHours();
    const day = date.getDay(); 
  
    const morningPeakStart =
      Number(process.env.MORNING_PEAK_START) || 8;
    const morningPeakEnd =
      Number(process.env.MORNING_PEAK_END) || 11;
  
    const eveningPeakStart =
      Number(process.env.EVENING_PEAK_START) || 17;
    const eveningPeakEnd =
      Number(process.env.EVENING_PEAK_END) || 20;
  
    const nightStart =
      Number(process.env.NIGHT_START_HOUR) || 21;
    const nightEnd =
      Number(process.env.NIGHT_END_HOUR) || 5;

    const isMorningPeak =
      hour >= morningPeakStart && hour < morningPeakEnd;
  
    const isEveningPeak =
      hour >= eveningPeakStart && hour < eveningPeakEnd;
  
    const isPeakHour = isMorningPeak || isEveningPeak;
  
   
    const isNight =
      hour >= nightStart || hour < nightEnd;
  
    const isDaytime = !isNight;

    const isWeekend = day === 0 || day === 6;
    const isWeekday = !isWeekend;

    return {
      hour,
      isPeakHour,
      isMorningPeak,
      isEveningPeak,
      isNight,
      isDaytime,
      isWeekend,
      isWeekday
    };
  }
  