import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  MessageSquareWarning,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Complaints",
    value: "156",
    subtitle: "+12 this week",
    icon: MessageSquareWarning,
    variant: "primary" as const,
    trend: { value: 8, isPositive: false },
  },
  {
    title: "Pending",
    value: "23",
    subtitle: "Awaiting action",
    icon: Clock,
    variant: "warning" as const,
  },
  {
    title: "In Progress",
    value: "45",
    subtitle: "Being resolved",
    icon: TrendingUp,
    variant: "default" as const,
  },
  {
    title: "Resolved",
    value: "88",
    subtitle: "This month",
    icon: CheckCircle,
    variant: "success" as const,
    trend: { value: 15, isPositive: true },
  },
];

const recentComplaints = [
  {
    id: "C156",
    title: "Factory smoke emission",
    ward: "East Ward",
    status: "pending",
    time: "2 hours ago",
  },
  {
    id: "C155",
    title: "Construction dust on main road",
    ward: "Central Ward",
    status: "in-progress",
    time: "5 hours ago",
  },
  {
    id: "C154",
    title: "Open waste burning",
    ward: "West Ward",
    status: "pending",
    time: "Yesterday",
  },
  {
    id: "C153",
    title: "Vehicle emission hotspot",
    ward: "North Ward",
    status: "resolved",
    time: "Yesterday",
  },
];

const statusColors = {
  pending: "bg-warning/20 text-warning-foreground border-warning/30",
  "in-progress": "bg-info/20 text-info border-info/30",
  resolved: "bg-success/20 text-success border-success/30",
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Monitor and manage citizen complaints
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.title}
              {...stat}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <div
            className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Complaints</h2>
              <a
                href="/admin/complaints"
                className="text-sm text-primary hover:underline"
              >
                View all →
              </a>
            </div>
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{complaint.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          statusColors[complaint.status as keyof typeof statusColors]
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{complaint.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {complaint.ward} • {complaint.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <h2 className="text-lg font-semibold mb-6">Priority Alerts</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-sm">High Priority</p>
                  <p className="text-sm text-muted-foreground">
                    5 complaints pending for more than 48 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
                <Clock className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Approaching SLA</p>
                  <p className="text-sm text-muted-foreground">
                    12 complaints nearing resolution deadline
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Ward Focus</p>
                  <p className="text-sm text-muted-foreground">
                    East Ward has the highest complaint volume today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
