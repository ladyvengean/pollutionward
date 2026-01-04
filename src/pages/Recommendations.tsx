import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Zap,
  Target,
  Users,
  Car,
  Factory,
  Trees,
  Recycle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  impact: string;
  authority: string;
  icon: React.ElementType;
  status?: "pending" | "in-progress" | "completed";
}

const shortTerm: Recommendation[] = [
  {
    id: "s1",
    title: "Implement Odd-Even Traffic Rule",
    description:
      "Restrict vehicles based on registration number to reduce traffic congestion and emissions in West Ward during peak hours.",
    priority: "high",
    impact: "15-20% reduction in vehicular emissions",
    authority: "Traffic Police Department",
    icon: Car,
    status: "pending",
  },
  {
    id: "s2",
    title: "Increase Water Sprinkling",
    description:
      "Deploy additional water sprinklers on construction sites and major roads to suppress dust particles.",
    priority: "high",
    impact: "10-15% reduction in PM2.5 levels",
    authority: "Municipal Corporation",
    icon: Recycle,
    status: "in-progress",
  },
  {
    id: "s3",
    title: "Issue Health Advisory",
    description:
      "Publish public health advisory for sensitive groups in areas with AQI above 150.",
    priority: "medium",
    impact: "Reduced health risks for 50K+ residents",
    authority: "Health Department",
    icon: Users,
    status: "completed",
  },
];

const midTerm: Recommendation[] = [
  {
    id: "m1",
    title: "Upgrade Public Transport Fleet",
    description:
      "Replace older diesel buses with CNG/electric alternatives on high-emission routes.",
    priority: "high",
    impact: "25-30% reduction in public transport emissions",
    authority: "Transport Department",
    icon: Car,
  },
  {
    id: "m2",
    title: "Install Air Quality Monitors",
    description:
      "Deploy 20 additional IoT-based air quality monitoring stations across all wards.",
    priority: "medium",
    impact: "Real-time monitoring coverage for 100% of city",
    authority: "Environment Department",
    icon: Target,
  },
  {
    id: "m3",
    title: "Industrial Emission Audit",
    description:
      "Conduct comprehensive emission audits of all industrial units and enforce compliance.",
    priority: "high",
    impact: "Identify and address 80% of industrial violations",
    authority: "Pollution Control Board",
    icon: Factory,
  },
];

const longTerm: Recommendation[] = [
  {
    id: "l1",
    title: "Urban Green Belt Development",
    description:
      "Develop green corridors along major highways and industrial zones with native pollution-absorbing trees.",
    priority: "high",
    impact: "Long-term 20-25% improvement in air quality",
    authority: "Forest Department & Urban Planning",
    icon: Trees,
  },
  {
    id: "l2",
    title: "Transition to Clean Energy",
    description:
      "Implement city-wide transition plan for renewable energy adoption in public infrastructure.",
    priority: "medium",
    impact: "40% reduction in energy-related emissions",
    authority: "Energy Department",
    icon: Zap,
  },
];

const priorityColors = {
  high: "aqiSevere",
  medium: "warning",
  low: "success",
} as const;

const statusColors = {
  pending: "secondary",
  "in-progress": "warning",
  completed: "success",
} as const;

function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
          <rec.icon className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold">{rec.title}</h3>
            <div className="flex items-center gap-2">
              {rec.status && (
                <Badge variant={statusColors[rec.status]} className="capitalize">
                  {rec.status === "in-progress" ? "In Progress" : rec.status}
                </Badge>
              )}
              <Badge variant={priorityColors[rec.priority]} className="capitalize">
                {rec.priority} Priority
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{rec.description}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-success" />
              <span className="text-muted-foreground">{rec.impact}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-info" />
              <span className="text-muted-foreground">{rec.authority}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategorySection({
  title,
  icon: Icon,
  description,
  items,
  color,
}: {
  title: string;
  icon: React.ElementType;
  description: string;
  items: Recommendation[];
  color: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl",
            color
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-4">
        {items.map((rec) => (
          <RecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}

export default function Recommendations() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold">Actionable Recommendations</h1>
          <p className="text-muted-foreground">
            Priority-based actions to improve air quality across all wards
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">High Priority</p>
            <p className="text-3xl font-bold text-destructive">5</p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Medium Priority</p>
            <p className="text-3xl font-bold text-warning-foreground">3</p>
          </div>
          <div className="bg-success/10 border border-success/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-success">1</p>
          </div>
          <div className="bg-info/10 border border-info/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold text-info">1</p>
          </div>
        </div>

        {/* Short Term */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CategorySection
            title="Short-Term Actions"
            icon={Zap}
            description="Immediate actions (1-4 weeks)"
            items={shortTerm}
            color="bg-destructive/10 text-destructive"
          />
        </div>

        {/* Mid Term */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CategorySection
            title="Mid-Term Actions"
            icon={Clock}
            description="Actions for next 1-6 months"
            items={midTerm}
            color="bg-warning/10 text-warning"
          />
        </div>

        {/* Long Term */}
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <CategorySection
            title="Long-Term Initiatives"
            icon={Target}
            description="Strategic actions (6+ months)"
            items={longTerm}
            color="bg-primary/10 text-primary"
          />
        </div>

        {/* CTA */}
        <div
          className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-primary-foreground animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Ready to Take Action?</h3>
              <p className="opacity-90">
                Download the complete action plan with detailed implementation guidelines.
              </p>
            </div>
            <Button variant="secondary" size="lg" className="gap-2">
              Download Report <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
