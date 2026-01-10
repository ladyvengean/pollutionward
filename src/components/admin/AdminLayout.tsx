import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-surface">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-border px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
        </header>
        
        {/* Content */}
        <div className="p-6 bg-surface">
          {children}
        </div>
      </main>
    </div>
  );
}
