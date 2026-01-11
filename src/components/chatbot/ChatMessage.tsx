interface Props {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`max-w-[85%] text-sm p-3 rounded-lg ${
        isUser
          ? "ml-auto bg-primary text-white"
          : "bg-muted text-foreground"
      }`}
    >
      {content}
    </div>
  );
}
