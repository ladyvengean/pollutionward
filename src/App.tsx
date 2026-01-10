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
import WardMap from "./components/WardMap";
import Map from "./pages/Map";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ward" element={<WardDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/citizen" element={<CitizenPortal />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/maps" element={<Map />} /> 


        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// function App() {
//   return <WardMap />;
// }

export default App;
