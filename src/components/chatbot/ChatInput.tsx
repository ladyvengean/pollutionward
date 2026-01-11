import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-3 border-t flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ask about pollution, health, actions…"
        className="flex-1 border rounded-lg px-3 py-2 text-sm"
        disabled={disabled}
      />
      <button
        onClick={submit}
        disabled={disabled}
        className="bg-primary text-white px-4 rounded-lg text-sm"
      >
        Send
      </button>
    </div>
  );
}
