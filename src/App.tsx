import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WardDetail from "./pages/WardDetail";
import Recommendations from "./pages/Recommendations";
import CitizenPortal from "./pages/CitizenPortal";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
import Map from "./pages/Map";

// Admin imports
import { AdminFloatingButton } from "./components/admin/AdminFloatingButton";
import { AdminAuthGuard } from "./components/admin/AdminAuthGuard";
import AdminIndex from "./pages/admin/AdminIndex";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Floating Admin Button - visible on all non-admin pages */}
        <AdminFloatingButton />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/ward" element={<WardDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/citizen" element={<CitizenPortal />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/maps" element={<Map />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<AdminAuthGuard><AdminIndex /></AdminAuthGuard>} />
          <Route path="/admin/dashboard" element={<AdminAuthGuard><AdminDashboard /></AdminAuthGuard>} />
          <Route path="/admin/complaints" element={<AdminAuthGuard><AdminComplaints /></AdminAuthGuard>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
