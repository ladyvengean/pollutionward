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
    <aside className="w-64 min-h-screen bg-primary text-primary-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-primary-foreground/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Admin Panel</h1>
            <p className="text-xs text-white/70">Pollution Control</p>
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
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-white/20 text-white font-medium" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              } ${item.disabled ? "opacity-50 pointer-events-none" : ""}`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
            {item.disabled && (
              <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded">
                Soon
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-foreground/20">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Exit Admin</span>
        </Button>
      </div>
    </aside>
  );
}
