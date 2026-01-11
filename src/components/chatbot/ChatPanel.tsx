import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  wardId: string;
  wardName: string;
  aqi: number;
  status: string;
  onClose: () => void;
}

export function ChatPanel({
  wardId,
  wardName,
  aqi,
  status,
  onClose,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Context-aware welcome message
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `I'm analyzing ${wardName} Ward. Current AQI is ${aqi} (${status}). Ask me why it's high, how it compares to the city, or what actions can help.`,
      },
    ]);
  }, [wardId]);

  const sendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wardId,
        message: text,
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply },
    ]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[520px] bg-card border rounded-xl shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Ward Assistant</h3>
        <button title="chatbot" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} {...msg} />
        ))}
        {loading && (
          <p className="text-sm text-muted-foreground">Analyzing ward data…</p>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
