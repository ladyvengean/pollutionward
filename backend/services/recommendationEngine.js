export function generateStructuredRecommendations({
    aqi,
    dominant_pollutant,
    zone,
    weather
  }) {
    const shortTerm = [];
    const midTerm = [];
    const longTerm = [];
  
    /* ---------- SHORT TERM ---------- */
    if (aqi > 200) {
      shortTerm.push({
        id: "st1",
        title: "Restrict Heavy Vehicle Movement",
        description:
          "Limit entry of diesel trucks and heavy vehicles during peak hours.",
        priority: "high",
        impact: "Immediate reduction in vehicular emissions",
        authority: "Traffic Police",
        icon: "Car",
        status: "pending"
      });
    }
  
    if (dominant_pollutant === "pm25") {
      shortTerm.push({
        id: "st2",
        title: "Water Sprinkling & Dust Suppression",
        description:
          "Increase water sprinkling at construction sites and arterial roads.",
        priority: "high",
        impact: "10–15% reduction in PM2.5",
        authority: "Municipal Corporation",
        icon: "Recycle",
        status: "in-progress"
      });
    }
  
    /* ---------- MID TERM ---------- */
    if (zone === "Industrial") {
      midTerm.push({
        id: "mt1",
        title: "Industrial Emission Audit",
        description:
          "Conduct compliance audits of nearby industrial units.",
        priority: "high",
        impact: "Identification of major emission sources",
        authority: "Pollution Control Board",
        icon: "Factory"
      });
    }
  
    midTerm.push({
      id: "mt2",
      title: "Public Transport Upgrade",
      description:
        "Replace aging diesel buses with electric/CNG buses.",
      priority: "medium",
      impact: "Reduced transport emissions",
      authority: "Transport Department",
      icon: "Car"
    });
  
    /* ---------- LONG TERM ---------- */
    longTerm.push({
      id: "lt1",
      title: "Urban Green Belt Development",
      description:
        "Develop green buffers around highways and industrial zones.",
      priority: "high",
      impact: "Long-term air quality improvement",
      authority: "Forest Department",
      icon: "Trees"
    });
  
    longTerm.push({
      id: "lt2",
      title: "Clean Energy Transition",
      description:
        "Shift public infrastructure to renewable energy sources.",
      priority: "medium",
      impact: "Reduced fossil fuel dependency",
      authority: "Energy Department",
      icon: "Zap"
    });
  
    return {
      short_term: shortTerm,
      mid_term: midTerm,
      long_term: longTerm
    };
  }
  