export interface AdminComplaint {
  id: string;
  title: string;
  category: string;
  ward: string;
  status: "pending" | "in-progress" | "resolved";
  submittedAt: string;
  description: string;
  location?: string;
  resolutionRemarks?: string;
  resolvedAt?: string;
  assignedTo?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "moderator" | "user";
  isAuthenticated: boolean;
}
