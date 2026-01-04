import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Download, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const wardComparisonData = [
  { ward: "Central", aqi: 45, prev: 52 },
  { ward: "North", aqi: 78, prev: 85 },
  { ward: "East", aqi: 156, prev: 142 },
  { ward: "South", aqi: 52, prev: 48 },
  { ward: "West", aqi: 210, prev: 195 },
  { ward: "NE", aqi: 89, prev: 92 },
  { ward: "SE", aqi: 134, prev: 128 },
  { ward: "NW", aqi: 67, prev: 72 },
  { ward: "SW", aqi: 41, prev: 45 },
];

const historicalData = [
  { month: "Jan", aqi: 95, target: 80 },
  { month: "Feb", aqi: 88, target: 80 },
  { month: "Mar", aqi: 102, target: 80 },
  { month: "Apr", aqi: 78, target: 80 },
  { month: "May", aqi: 85, target: 80 },
  { month: "Jun", aqi: 92, target: 80 },
  { month: "Jul", aqi: 98, target: 80 },
  { month: "Aug", aqi: 105, target: 80 },
  { month: "Sep", aqi: 88, target: 80 },
  { month: "Oct", aqi: 95, target: 80 },
  { month: "Nov", aqi: 112, target: 80 },
  { month: "Dec", aqi: 87, target: 80 },
];

const sourceDistribution = [
  { name: "Traffic", value: 38, color: "hsl(var(--primary))" },
  { name: "Industry", value: 28, color: "hsl(var(--warning))" },
  { name: "Construction", value: 22, color: "hsl(var(--info))" },
  { name: "Waste", value: 12, color: "hsl(var(--destructive))" },
];

const hotspotData = [
  { area: "Industrial Zone A", severity: 95 },
  { area: "Main Highway Junction", severity: 88 },
  { area: "West Market Area", severity: 82 },
  { area: "Railway Station", severity: 75 },
  { area: "Bus Terminal", severity: 70 },
];

const anomalies = [
  {
    id: 1,
    type: "spike",
    description: "Sudden 40% AQI increase in West Ward",
    time: "Today, 2:30 PM",
    severity: "high",
  },
  {
    id: 2,
    type: "pattern",
    description: "Consistent morning pollution peaks in East Ward",
    time: "Last 7 days",
    severity: "medium",
  },
  {
    id: 3,
    type: "improvement",
    description: "Southwest Ward showing sustained improvement",
    time: "This month",
    severity: "low",
  },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Insights</h1>
            <p className="text-muted-foreground">
              Comprehensive pollution data analysis for officials
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Ward Comparison */}
        <div
          className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Ward Comparison</h2>
              <p className="text-sm text-muted-foreground">
                Current vs Previous Month AQI Levels
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-xs text-muted-foreground">Previous</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="ward"
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
                <Bar
                  dataKey="prev"
                  fill="hsl(var(--secondary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="aqi"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historical Trends */}
          <div
            className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Historical Trends</h2>
              <p className="text-sm text-muted-foreground">
                12-month AQI trend vs target
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorHist)"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Distribution */}
          <div
            className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Source Distribution</h2>
              <p className="text-sm text-muted-foreground">
                City-wide pollution contributors
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {sourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hotspots */}
          <div
            className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Pollution Hotspots</h2>
              <p className="text-sm text-muted-foreground">
                Areas requiring immediate attention
              </p>
            </div>
            <div className="space-y-4">
              {hotspotData.map((spot, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{spot.area}</span>
                    <span
                      className={
                        spot.severity > 80
                          ? "text-destructive font-bold"
                          : spot.severity > 60
                          ? "text-warning font-bold"
                          : "text-muted-foreground"
                      }
                    >
                      {spot.severity}% severity
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        spot.severity > 80
                          ? "bg-destructive"
                          : spot.severity > 60
                          ? "bg-warning"
                          : "bg-primary"
                      }`}
                      style={{ width: `${spot.severity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomalies */}
          <div
            className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Alerts & Anomalies</h2>
              <p className="text-sm text-muted-foreground">
                Recent patterns and deviations
              </p>
            </div>
            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`p-4 rounded-lg border ${
                    anomaly.severity === "high"
                      ? "bg-destructive/10 border-destructive/20"
                      : anomaly.severity === "medium"
                      ? "bg-warning/10 border-warning/20"
                      : "bg-success/10 border-success/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {anomaly.severity === "high" ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : anomaly.severity === "medium" ? (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-success" />
                    )}
                    <span className="font-semibold text-sm">
                      {anomaly.description}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{anomaly.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div
          className="bg-primary/5 border border-primary/20 rounded-xl p-6 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-xl font-semibold mb-4">Key Metrics Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Avg AQI (City)</p>
              <p className="text-3xl font-bold">87</p>
              <p className="text-sm text-success flex items-center gap-1">
                <TrendingDown className="h-3 w-3" /> 5% from last month
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days Above Target</p>
              <p className="text-3xl font-bold">18</p>
              <p className="text-sm text-destructive flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> 3 more than target
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Complaints Resolved</p>
              <p className="text-3xl font-bold">142</p>
              <p className="text-sm text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> 85% resolution rate
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Actions Implemented</p>
              <p className="text-3xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">
                of 12 planned this quarter
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
