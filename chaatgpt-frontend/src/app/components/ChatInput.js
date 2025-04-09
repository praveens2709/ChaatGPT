"use client";

import { RiSendPlaneFill } from "react-icons/ri";
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSendClick = () => {
    if (text.trim() !== "") {
      onSend(text);
      setText("");
    }
  };

  return (
    <div
      className="p-3 py-4 d-flex align-items-center rounded-4"
      style={{
        backgroundColor: "var(--input-color)",
        color: "var(--text-color)",
      }}
    >
      <textarea
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="me-2 flex-grow-1 bg-transparent border-0 form-control"
        placeholder="Type your message..."
        style={{
          minHeight: "2.5em",
          resize: "none",
          overflowY: "auto",
          maxHeight: "8em",
          color: "var(--text-color)",
        }}
      ></textarea>

      <div
        onClick={handleSendClick}
        className="rounded-circle d-flex align-items-center justify-content-center send-icon"
        style={{
          width: "40px",
          height: "40px",
          cursor: "pointer",
          backgroundColor: "var(--text-color)",
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <RiSendPlaneFill style={{ fontSize: "20px", color: "var(--bg-color)" }} />
      </div>
    </div>
  );
}
