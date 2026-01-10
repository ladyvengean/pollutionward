import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AdminComplaint } from "@/types/admin";

// Complaints will be loaded from backend
const initialComplaints: AdminComplaint[] = [];

const statusConfig = {
  pending: { 
    label: "Pending", 
    variant: "warning" as const, 
    icon: AlertCircle 
  },
  "in-progress": { 
    label: "In Progress", 
    variant: "info" as const, 
    icon: Clock 
  },
  resolved: { 
    label: "Resolved", 
    variant: "success" as const, 
    icon: CheckCircle 
  },
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<AdminComplaint[]>(initialComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<AdminComplaint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editStatus, setEditStatus] = useState<string>("");
  const [editRemarks, setEditRemarks] = useState("");
  const { toast } = useToast();

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.ward.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openComplaintDetail = (complaint: AdminComplaint) => {
    setSelectedComplaint(complaint);
    setEditStatus(complaint.status);
    setEditRemarks(complaint.resolutionRemarks || "");
    setIsDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedComplaint) return;

    const updatedComplaints = complaints.map((c) => {
      if (c.id === selectedComplaint.id) {
        return {
          ...c,
          status: editStatus as AdminComplaint["status"],
          resolutionRemarks: editRemarks,
          resolvedAt: editStatus === "resolved" ? new Date().toISOString() : c.resolvedAt,
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
    setIsDialogOpen(false);
    
    toast({
      title: "Complaint Updated",
      description: `Complaint #${selectedComplaint.id} has been updated successfully.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    let mounted = true;
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/complaints");
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || "Failed to fetch");
        const mapped: AdminComplaint[] = body.data.map((c: any) => ({
          id: c._id,
          title: c.title,
          category: c.category,
          ward: c.ward,
          status: c.status,
          submittedAt: c.createdAt,
          description: c.description,
          location: c.location,
          resolutionRemarks: c.resolutionRemarks,
          resolvedAt: c.resolvedAt,
        }));
        if (mounted) setComplaints(mapped);
      } catch (err) {
        // ignore for now; Admin UI can show empty state
        console.error("Failed to load complaints", err);
      }
    };

    fetchComplaints();
    const id = setInterval(fetchComplaints, 10000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold">Complaints Management</h1>
          <p className="text-muted-foreground">
            View and manage citizen-submitted pollution complaints
          </p>
        </div>

        {/* Filters */}
        <div
          className="flex flex-col sm:flex-row gap-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, title, or ward..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">
              {complaints.filter((c) => c.status === "pending").length}
            </p>
          </div>
          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold">
              {complaints.filter((c) => c.status === "in-progress").length}
            </p>
          </div>
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold">
              {complaints.filter((c) => c.status === "resolved").length}
            </p>
          </div>
        </div>

        {/* Complaints Table */}
        <div
          className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => {
                const config = statusConfig[complaint.status];
                const StatusIcon = config.icon;
                return (
                  <TableRow key={complaint.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">
                      #{complaint.id}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {complaint.title}
                    </TableCell>
                    <TableCell>{complaint.ward}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {complaint.category}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(complaint.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openComplaintDetail(complaint)}
                        className="gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredComplaints.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No complaints found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Complaint Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Complaint #{selectedComplaint?.id}
                {selectedComplaint && (
                  <Badge variant={statusConfig[selectedComplaint.status].variant}>
                    {statusConfig[selectedComplaint.status].label}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedComplaint && (
              <div className="space-y-6">
                {/* Complaint Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedComplaint.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {selectedComplaint.category}
                    </p>
                  </div>

                  <p className="text-sm">{selectedComplaint.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedComplaint.ward}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(selectedComplaint.submittedAt)}</span>
                    </div>
                  </div>

                  {selectedComplaint.location && (
                    <div className="bg-muted/30 rounded-lg p-3 text-sm">
                      <span className="font-medium">Location: </span>
                      {selectedComplaint.location}
                    </div>
                  )}
                </div>

                {/* Admin Actions */}
                <div className="border-t border-border pt-6 space-y-4">
                  <h4 className="font-semibold">Update Status</h4>
                  
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={editStatus} onValueChange={setEditStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Resolution Remarks</Label>
                    <Textarea
                      placeholder="Add remarks about the resolution or progress..."
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
