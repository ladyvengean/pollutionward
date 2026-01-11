import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./ChatPanel";

interface ChatBotProps {
  wardId: string;
  wardName: string;
  aqi: number;
  status: string;
}

export function ChatBot({ wardId, wardName, aqi, status }: ChatBotProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Optional: hide chatbot on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg 
                   hover:shadow-xl transition-all duration-300 hover:scale-105 
                   bg-primary hover:bg-primary/90"
        size="icon"
        aria-label="Open Chatbot"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Panel */}
      {open && (
        <ChatPanel
          wardId={wardId}
          wardName={wardName}
          aqi={aqi}
          status={status}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
