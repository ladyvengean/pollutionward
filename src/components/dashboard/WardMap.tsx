import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Ward {
  id: string;
  name: string;
  aqi: number;
  status: "good" | "moderate" | "poor" | "severe";
}

const wards: Ward[] = [
  { id: "W1", name: "Central", aqi: 45, status: "good" },
  { id: "W2", name: "North", aqi: 78, status: "moderate" },
  { id: "W3", name: "East", aqi: 156, status: "poor" },
  { id: "W4", name: "South", aqi: 52, status: "good" },
  { id: "W5", name: "West", aqi: 210, status: "severe" },
  { id: "W6", name: "Northeast", aqi: 89, status: "moderate" },
  { id: "W7", name: "Southeast", aqi: 134, status: "poor" },
  { id: "W8", name: "Northwest", aqi: 67, status: "moderate" },
  { id: "W9", name: "Southwest", aqi: 41, status: "good" },
];

const statusColors = {
  good: "bg-aqi-good hover:bg-aqi-good/80",
  moderate: "bg-aqi-moderate hover:bg-aqi-moderate/80",
  poor: "bg-aqi-poor hover:bg-aqi-poor/80",
  severe: "bg-aqi-severe hover:bg-aqi-severe/80 animate-pulse-gentle",
};

const statusTextColors = {
  good: "text-white",
  moderate: "text-black",
  poor: "text-white",
  severe: "text-white",
};

export function WardMap() {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">City Ward Map</h2>
          <p className="text-sm text-muted-foreground">
            Click on a ward to view details
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Simplified Grid Map */}
      <div className="grid grid-cols-3 gap-2 aspect-square max-w-md mx-auto">
        {wards.map((ward) => (
          <button
            key={ward.id}
            onClick={() => navigate(`/ward?id=${ward.id}`)}
            className={cn(
              "relative rounded-lg p-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer",
              statusColors[ward.status],
              statusTextColors[ward.status]
            )}
          >
            <div className="text-center">
              <p className="font-bold text-sm">{ward.name}</p>
              <p className="text-2xl font-bold">{ward.aqi}</p>
              <p className="text-xs opacity-80">AQI</p>
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-aqi-good" />
          <span className="text-xs text-muted-foreground">Good (0-50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-aqi-moderate" />
          <span className="text-xs text-muted-foreground">Moderate (51-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-aqi-poor" />
          <span className="text-xs text-muted-foreground">Poor (101-200)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-aqi-severe" />
          <span className="text-xs text-muted-foreground">Severe (200+)</span>
        </div>
      </div>
    </div>
  );
}
