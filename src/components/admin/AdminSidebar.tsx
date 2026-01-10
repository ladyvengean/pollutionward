import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Bell,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Complaints",
    href: "/admin/complaints",
    icon: MessageSquareWarning,
  },
  {
    title: "Alerts",
    href: "/admin/alerts",
    icon: Bell,
    disabled: true,
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin session (placeholder logic)
    localStorage.removeItem("admin_authenticated");
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar-background text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-sidebar-foreground/70">Pollution Control</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""} ${
                item.disabled ? "opacity-50 pointer-events-none" : ""
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
            {item.disabled && (
              <span className="ml-auto text-xs bg-sidebar-accent px-2 py-0.5 rounded">
                Soon
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Exit Admin</span>
        </Button>
      </div>
    </aside>
  );
}
