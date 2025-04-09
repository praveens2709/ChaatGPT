export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`d-flex ${isUser ? "justify-content-end" : "justify-content-start"} mb-2`}>
      <div
        className={`p-2 rounded-5`}
        style={{
          maxWidth: "75%",
          backgroundColor: isUser ? "var(--input-color)" : "var(--secondary-color)",
          color: "var(--text-color)",
        }}
      >
        {content}
      </div>
    </div>
  );
}
