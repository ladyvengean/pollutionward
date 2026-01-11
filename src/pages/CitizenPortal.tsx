import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Camera,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Complaint {
  id: string;
  title: string;
  category: string;
  ward: string;
  status: "pending" | "submitted" | "under-review" | "in-progress" | "resolved";
  date: string;
  description: string;
}

const initialComplaints: Complaint[] = [
  {
    id: "C001",
    title: "Excessive smoke from factory",
    category: "Industrial Emission",
    ward: "East Ward",
    status: "in-progress",
    date: "2024-01-15",
    description: "Black smoke observed from the textile factory on MG Road.",
  },
  {
    id: "C002",
    title: "Construction dust pollution",
    category: "Construction",
    ward: "Central Ward",
    status: "resolved",
    date: "2024-01-12",
    description: "Heavy dust from ongoing metro construction site.",
  },
  {
    id: "C003",
    title: "Open waste burning",
    category: "Waste Burning",
    ward: "West Ward",
    status: "under-review",
    date: "2024-01-18",
    description: "Daily waste burning observed in vacant plot near school.",
  },
];



const statusConfig = {
  pending: { color: "warning", icon: AlertCircle, label: "Pending" },
  submitted: { color: "secondary", icon: FileText, label: "Submitted" },
  "under-review": { color: "warning", icon: Search, label: "Under Review" },
  "in-progress": { color: "info", icon: Clock, label: "In Progress" },
  resolved: { color: "success", icon: CheckCircle, label: "Resolved" },
} as const;

const categories = [
  "Industrial Emission",
  "Vehicle Pollution",
  "Construction Dust",
  "Waste Burning",
  "Other",
];

const wards = [
  "Central Ward",
  "North Ward",
  "East Ward",
  "South Ward",
  "West Ward",
  "Northeast Ward",
  "Southeast Ward",
  "Northwest Ward",
  "Southwest Ward",
];

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const config = statusConfig[complaint.status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{complaint.title}</h3>
            <Badge variant={config.color as any}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {complaint.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {complaint.ward}
            </span>
            <span>{complaint.category}</span>
            <span>{complaint.date}</span>
            <span className="font-mono">#{complaint.id}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          {["submitted", "under-review", "in-progress", "resolved"].map(
            (step, index) => {
              const stepIndex = [
                "submitted",
                "under-review",
                "in-progress",
                "resolved",
              ].indexOf(complaint.status);
              const isCompleted = index <= stepIndex;
              const isCurrent = index === stepIndex;

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isCompleted
                        ? isCurrent
                          ? "bg-primary animate-pulse"
                          : "bg-success"
                        : "bg-muted"
                    }`}
                  />
                  {index < 3 && (
                    <div
                      className={`w-8 h-0.5 ${
                        index < stepIndex ? "bg-success" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Submitted</span>
          <span>Review</span>
          <span>Progress</span>
          <span>Resolved</span>
        </div>
      </div>
    </div>
  );
}

export default function CitizenPortal() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    ward: "",
    description: "",
    location: "",
  });
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Failed to submit");

      const created = body.data;
      const newItem: Complaint = {
        id: created._id,
        title: created.title,
        category: created.category,
        ward: created.ward,
        status: created.status || "pending",
        date: created.createdAt ? new Date(created.createdAt).toLocaleDateString() : "",
        description: created.description,
      };

      setComplaints((p) => [newItem, ...p]);

      toast({
        title: "Complaint Submitted Successfully",
        description: `Your complaint has been registered. Track ID: ${newItem.id}`,
      });

      setFormData({ title: "", category: "", ward: "", description: "", location: "" });
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message || String(err) });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Citizen Engagement Portal</h1>
            <p className="text-muted-foreground">
              Report pollution issues and track your complaints
            </p>
          </div>

          <div className="ml-4 flex items-center">
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 flex items-center gap-3">
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold">Take a pledge today</span>
                <span className="text-xs text-muted-foreground">Commit to cleaner air — it takes 2 minutes</span>
              </div>

              <Button asChild variant="default" size="sm" className="whitespace-nowrap">
  <Link to="/takeapledge" className="flex items-center gap-2">
    <CheckCircle className="h-4 w-4" />
    Pledge Now
  </Link>
</Button>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Complaint Form */}
          <div
            className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Report Pollution Issue</h2>
                <p className="text-sm text-muted-foreground">
                  Submit geo-tagged complaints
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ward</Label>
                  <Select
                    value={formData.ward}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ward: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward} value={ward}>
                          {ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location / Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    className="pl-10"
                    placeholder="Enter specific location or address"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the pollution issue in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Attach Photo (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" size="lg">
                <Send className="h-4 w-4" />
                Submit Complaint
              </Button>
            </form>
          </div>

          {/* Complaint Tracking */}
          <div className="space-y-6">
            <div
              className="animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Track Your Complaints</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID..."
                    className="pl-10 w-40"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div
              className="bg-primary/5 border border-primary/20 rounded-xl p-5 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="font-semibold mb-2">How It Works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    1
                  </span>
                  Submit your complaint with location details
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    2
                  </span>
                  Our team reviews and assigns it to the relevant authority
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    3
                  </span>
                  Track progress and receive updates via SMS/Email
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    4
                  </span>
                  Issue resolved and marked complete
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
