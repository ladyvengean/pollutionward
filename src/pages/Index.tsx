import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { WardMap } from "@/components/dashboard/WardMap";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { PollutionTrend } from "@/components/dashboard/PollutionTrend";
import { SourceAttribution } from "@/components/dashboard/SourceAttribution";
import { Wind, MapPin, TrendingDown, Factory } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 animate-fade-in">
          <h1 className="text-3xl font-bold">Ward-wise Pollution Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time air quality monitoring and action insights for city authorities
          </p>
        </div>

        {/* Alert Banner */}
        <AlertBanner />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="animate-fade-in stagger-1">
            <StatCard
              title="City Average AQI"
              value={87}
              subtitle="Moderate quality"
              icon={Wind}
              trend={{ value: 5, isPositive: true }}
              variant="primary"
            />
          </div>
          <div className="animate-fade-in stagger-2">
            <StatCard
              title="Most Polluted"
              value="West Ward"
              subtitle="AQI: 210 (Severe)"
              icon={MapPin}
              variant="danger"
            />
          </div>
          <div className="animate-fade-in stagger-3">
            <StatCard
              title="Cleanest Ward"
              value="Southwest"
              subtitle="AQI: 41 (Good)"
              icon={TrendingDown}
              variant="success"
            />
          </div>
          <div className="animate-fade-in stagger-4">
            <StatCard
              title="Major Contributor"
              value="Traffic"
              subtitle="38% of emissions"
              icon={Factory}
              variant="warning"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <WardMap />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <PollutionTrend />
          </div>
        </div>

        {/* Secondary Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <SourceAttribution />
          </div>
          <div
            className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <h2 className="text-xl font-semibold mb-4">Quick Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="font-semibold text-destructive">⚠️ Critical Alert</p>
                <p className="text-sm text-muted-foreground mt-1">
                  West Ward has exceeded safe AQI levels for 3 consecutive days.
                  Immediate action required.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="font-semibold text-success">✓ Improvement</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Southwest Ward shows 15% improvement after traffic restrictions
                  implemented last week.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="font-semibold text-warning-foreground">📊 Trend</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Industrial emissions peaked during morning hours (9AM-11AM).
                  Consider scheduling restrictions.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                <p className="font-semibold text-info">ℹ️ Forecast</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Weather conditions tomorrow may improve air dispersion.
                  Moderate AQI expected city-wide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
