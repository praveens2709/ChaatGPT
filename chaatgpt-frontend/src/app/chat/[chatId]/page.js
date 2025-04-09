"use client";

import { useParams } from "next/navigation";
import ChatHeader from "../../components/ChatHeader";
import ChatInput from "../../components/ChatInput";
import MessageBubble from "../../components/MessageBubble";
import Sidebar from "../../components/Sidebar";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ChatPage() {
  const { chatId } = useParams();
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  const handleSend = async (text) => {
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setShowGreeting(false);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      const aiMsg = { role: "ai", content: data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error fetching response." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <>
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      <div className="d-flex flex-column flex-grow-1">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          showToggle={!sidebarOpen}
        />
        <div
          className="d-flex flex-grow-1 overflow-auto flex-column justify-content-between pt-3 pb-5 px-10"
          style={{
            backgroundColor: "var(--secondary-color)",
            color: "var(--text-color)",
          }}
        >
          <div className="flex-grow-1 overflow-auto position-relative">
            {messages.length === 0 && showGreeting ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="d-flex justify-content-center align-items-center h-100 fw-semibold"
                style={{ fontSize: "1.25rem", color: "var(--muted-color)" }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    repeatType: "reverse",
                  }}
                >
                  How may I assist you today?
                </motion.span>
              </motion.div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} role={msg.role} content={msg.content} />
                ))}
                {isTyping && (
                  <div className="d-flex justify-content-start mb-2 px-3">
                    <div className="typing-indicator">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>
          <ChatInput onSend={handleSend} />
        </div>
      </div>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 6px;
          align-items: flex-end;
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: var(--text-color);
          border-radius: 50%;
          animation: bounce 1s infinite ease-in-out;
        }
        .dot:nth-child(2) {
          animation-delay: 0.1s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.2s;
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }        
      `}</style>
    </>
  );
}
