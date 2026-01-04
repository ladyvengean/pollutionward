import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: "warning" | "severe";
  ward: string;
  message: string;
  time: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "severe",
    ward: "West Ward",
    message: "AQI exceeds 200 - Health advisory in effect",
    time: "5 mins ago",
  },
];

export function AlertBanner() {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const activeAlerts = alerts.filter((a) => !dismissed.includes(a.id));

  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {activeAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            alert.type === "severe"
              ? "bg-destructive/10 border-destructive/30 text-destructive"
              : "bg-warning/10 border-warning/30 text-warning-foreground"
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <div>
              <p className="font-semibold">{alert.ward}</p>
              <p className="text-sm opacity-90">{alert.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs opacity-70">{alert.time}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDismissed([...dismissed, alert.id])}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
