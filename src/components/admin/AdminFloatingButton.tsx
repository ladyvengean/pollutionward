import { Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function AdminFloatingButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Button
      onClick={() => navigate("/chatbot")}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary/90"
      size="icon"
      aria-label="Open Admin Panel"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
