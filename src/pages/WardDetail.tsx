import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { SourceAttribution } from "@/components/dashboard/SourceAttribution";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  ArrowLeft,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const trendData = [
  { date: "Mon", aqi: 85, cityAvg: 78 },
  { date: "Tue", aqi: 92, cityAvg: 82 },
  { date: "Wed", aqi: 78, cityAvg: 75 },
  { date: "Thu", aqi: 156, cityAvg: 88 },
  { date: "Fri", aqi: 145, cityAvg: 92 },
  { date: "Sat", aqi: 168, cityAvg: 95 },
  { date: "Sun", aqi: 178, cityAvg: 87 },
];

const insights = [
  {
    title: "Peak Pollution Hours",
    description:
      "Highest AQI recorded between 8AM-10AM, coinciding with morning traffic rush.",
    icon: TrendingUp,
    type: "warning" as const,
  },
  {
    title: "Construction Activity",
    description:
      "New construction site on Main Street contributing to particulate matter increase.",
    icon: Eye,
    type: "info" as const,
  },
  {
    title: "Weekend Spike",
    description:
      "Industrial activity on weekends causing 20% higher emissions than weekdays.",
    icon: TrendingDown,
    type: "danger" as const,
  },
];

const wardData = {
  W1: { name: "Central", aqi: 45, status: "good" as const },
  W2: { name: "North", aqi: 78, status: "moderate" as const },
  W3: { name: "East", aqi: 156, status: "poor" as const },
  W4: { name: "South", aqi: 52, status: "good" as const },
  W5: { name: "West", aqi: 210, status: "severe" as const },
  W6: { name: "Northeast", aqi: 89, status: "moderate" as const },
  W7: { name: "Southeast", aqi: 134, status: "poor" as const },
  W8: { name: "Northwest", aqi: 67, status: "moderate" as const },
  W9: { name: "Southwest", aqi: 41, status: "good" as const },
};

const statusBadgeVariant = {
  good: "aqiGood" as const,
  moderate: "aqiModerate" as const,
  poor: "aqiPoor" as const,
  severe: "aqiSevere" as const,
};

const statusLabel = {
  good: "Good",
  moderate: "Moderate",
  poor: "Poor",
  severe: "Severe",
};

export default function WardDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const wardId = searchParams.get("id") || "W3";
  const ward = wardData[wardId as keyof typeof wardData] || wardData.W3;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 animate-fade-in">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{ward.name} Ward</h1>
              <Badge variant={statusBadgeVariant[ward.status]} className="text-sm px-3 py-1">
                {statusLabel[ward.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Detailed pollution analysis and insights
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{ward.aqi}</p>
            <p className="text-sm text-muted-foreground">Current AQI</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <StatCard
            title="Temperature"
            value="32°C"
            icon={Thermometer}
            variant="default"
          />
          <StatCard
            title="Humidity"
            value="65%"
            icon={Droplets}
            variant="default"
          />
          <StatCard
            title="Wind Speed"
            value="12 km/h"
            icon={Wind}
            variant="default"
          />
          <StatCard
            title="Visibility"
            value="8 km"
            icon={Eye}
            variant="default"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Chart */}
          <div
            className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Weekly Trend</h2>
                <p className="text-sm text-muted-foreground">
                  AQI comparison with city average
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-xs text-muted-foreground">Ward AQI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">City Avg</span>
                </div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <ReferenceLine
                    y={100}
                    stroke="hsl(var(--warning))"
                    strokeDasharray="5 5"
                    label={{ value: "Threshold", fill: "hsl(var(--warning))", fontSize: 10 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cityAvg"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="aqi"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Attribution */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <SourceAttribution />
          </div>
        </div>

        {/* Insights */}
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border ${
                  insight.type === "warning"
                    ? "bg-warning/10 border-warning/20"
                    : insight.type === "danger"
                    ? "bg-destructive/10 border-destructive/20"
                    : "bg-info/10 border-info/20"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <insight.icon
                    className={`h-5 w-5 ${
                      insight.type === "warning"
                        ? "text-warning"
                        : insight.type === "danger"
                        ? "text-destructive"
                        : "text-info"
                    }`}
                  />
                  <h3 className="font-semibold">{insight.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Bar */}
        <div
          className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <h2 className="text-xl font-semibold mb-4">Comparison with City Average</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{ward.name} Ward</span>
                <span className="font-bold">{ward.aqi} AQI</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((ward.aqi / 300) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>City Average</span>
                <span className="font-bold">87 AQI</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(87 / 300) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {ward.aqi > 87
              ? `${ward.name} Ward is ${Math.round(((ward.aqi - 87) / 87) * 100)}% above the city average.`
              : `${ward.name} Ward is ${Math.round(((87 - ward.aqi) / 87) * 100)}% below the city average.`}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
