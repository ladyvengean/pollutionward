import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle,
  Clock,
  Filter,
  MapPin,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
async function updateNotifications(payload: {
  dailySummary?: boolean;
  emailNotifications?: boolean;
}) {
  await fetch("http://localhost:8000/api/notifications/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}


interface Alert {
  id: string;
  type: "threshold" | "spike" | "pattern" | "health";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  ward: string;
  time: string;
  acknowledged: boolean;
}

const alerts: Alert[] = [
  {
    id: "A001",
    type: "threshold",
    severity: "critical",
    title: "AQI Threshold Exceeded",
    description:
      "West Ward AQI has exceeded 200. Immediate health advisory recommended.",
    ward: "West Ward",
    time: "5 minutes ago",
    acknowledged: false,
  },
  {
    id: "A002",
    type: "spike",
    severity: "critical",
    title: "Sudden Pollution Spike",
    description:
      "40% increase in PM2.5 levels detected in East Ward within the last hour.",
    ward: "East Ward",
    time: "15 minutes ago",
    acknowledged: false,
  },
  {
    id: "A003",
    type: "threshold",
    severity: "warning",
    title: "Approaching Threshold",
    description:
      "Southeast Ward AQI at 145. Approaching poor category threshold (150).",
    ward: "Southeast Ward",
    time: "32 minutes ago",
    acknowledged: true,
  },
  {
    id: "A004",
    type: "pattern",
    severity: "warning",
    title: "Recurring Pattern Detected",
    description:
      "Industrial zone showing consistent evening spikes for 5 consecutive days.",
    ward: "North Ward",
    time: "1 hour ago",
    acknowledged: true,
  },
  {
    id: "A005",
    type: "health",
    severity: "info",
    title: "Health Advisory Active",
    description:
      "Sensitive groups advised to limit outdoor activities in affected areas.",
    ward: "City-wide",
    time: "2 hours ago",
    acknowledged: true,
  },
  {
    id: "A006",
    type: "threshold",
    severity: "info",
    title: "AQI Improved",
    description: "Southwest Ward AQI has dropped to Good category (41).",
    ward: "Southwest Ward",
    time: "3 hours ago",
    acknowledged: true,
  },
];

const severityConfig = {
  critical: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    icon: "text-destructive",
    badge: "aqiSevere",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: "text-warning",
    badge: "warning",
  },
  info: {
    bg: "bg-info/10",
    border: "border-info/30",
    icon: "text-info",
    badge: "info",
  },
} as const;

const typeIcons = {
  threshold: AlertTriangle,
  spike: TrendingUp,
  pattern: Clock,
  health: Bell,
};

function AlertCard({
  alert,
  onAcknowledge,
  onDismiss,
}: {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const config = severityConfig[alert.severity];
  const Icon = typeIcons[alert.type];

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all duration-300",
        config.bg,
        config.border,
        !alert.acknowledged && "shadow-lg"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            config.bg
          )}
        >
          <Icon className={cn("h-5 w-5", config.icon)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{alert.title}</h3>
            <Badge variant={config.badge as any} className="capitalize">
              {alert.severity}
            </Badge>
            {alert.acknowledged && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Acknowledged
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {alert.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {alert.ward}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {alert.time}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!alert.acknowledged && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAcknowledge(alert.id)}
            >
              Acknowledge
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDismiss(alert.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Alerts() {
  const [alertList, setAlertList] = useState(alerts);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">(
    "all"
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);


  const handleAcknowledge = (id: string) => {
    setAlertList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleDismiss = (id: string) => {
    setAlertList((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAlerts =
    filter === "all"
      ? alertList
      : alertList.filter((a) => a.severity === filter);

  const criticalCount = alertList.filter(
    (a) => a.severity === "critical" && !a.acknowledged
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
            <p className="text-muted-foreground">
              Real-time pollution alerts and threshold breach warnings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {notificationsEnabled ? (
                <Bell className="h-4 w-4 text-muted-foreground" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Label htmlFor="notifications" className="text-sm">
                Notifications
              </Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {criticalCount > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-destructive">
                  {criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""}{" "}
                  Require Attention
                </p>
                <p className="text-sm text-muted-foreground">
                  Immediate action recommended for affected areas
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setFilter("critical")}
            >
              View Critical
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all",
              filter === "all"
                ? "bg-primary/10 border-primary"
                : "bg-card border-border hover:border-primary/50"
            )}
            onClick={() => setFilter("all")}
          >
            <p className="text-sm text-muted-foreground">Total Alerts</p>
            <p className="text-3xl font-bold">{alertList.length}</p>
          </div>
          <div
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all",
              filter === "critical"
                ? "bg-destructive/10 border-destructive"
                : "bg-card border-border hover:border-destructive/50"
            )}
            onClick={() => setFilter("critical")}
          >
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-3xl font-bold text-destructive">
              {alertList.filter((a) => a.severity === "critical").length}
            </p>
          </div>
          <div
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all",
              filter === "warning"
                ? "bg-warning/10 border-warning"
                : "bg-card border-border hover:border-warning/50"
            )}
            onClick={() => setFilter("warning")}
          >
            <p className="text-sm text-muted-foreground">Warning</p>
            <p className="text-3xl font-bold text-warning-foreground">
              {alertList.filter((a) => a.severity === "warning").length}
            </p>
          </div>
          <div
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all",
              filter === "info"
                ? "bg-info/10 border-info"
                : "bg-card border-border hover:border-info/50"
            )}
            onClick={() => setFilter("info")}
          >
            <p className="text-sm text-muted-foreground">Info</p>
            <p className="text-3xl font-bold text-info">
              {alertList.filter((a) => a.severity === "info").length}
            </p>
          </div>
        </div>

        {/* Alert List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filter === "all" ? "All Alerts" : `${filter} Alerts`}
            </h2>
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <AlertCard
                    alert={alert}
                    onAcknowledge={handleAcknowledge}
                    onDismiss={handleDismiss}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No alerts to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        
        <div
          className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">AQI Threshold Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when AQI exceeds configured thresholds
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Sudden Spike Detection</p>
                <p className="text-sm text-muted-foreground">
                  Alert when pollution levels change rapidly
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Daily Summary</p>
                <p className="text-sm text-muted-foreground">
                  Receive daily pollution summary at 8 AM
                </p>
              </div>
              <Switch
  checked={dailySummary}
  onCheckedChange={(checked) => {
    setDailySummary(checked);
    updateNotifications({ dailySummary: checked });
  }}
/>

            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Send critical alerts via email
                </p>
              </div>
              <Switch
  checked={emailNotifications}
  onCheckedChange={(checked) => {
    setEmailNotifications(checked);
    updateNotifications({ emailNotifications: checked });
  }}
/>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
