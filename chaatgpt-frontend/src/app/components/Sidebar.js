"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { BiEdit, BiSearch } from "react-icons/bi";
import { createChat } from "../api/gemini/chatService";
import { useChatContext } from "../contexts/chatContext";

export default function Sidebar({ onClose }) {
  const { groupedChats, fetchChats } = useChatContext();
  const [theme, setTheme] = useState("light");
  const router = useRouter();
  const pathname = usePathname();

  const handleNewChat = async () => {
    try {
      const newChat = await createChat();
      await fetchChats();
      router.push(`/chat/${newChat._id}`);
    } catch (err) {
      console.error("Error creating new chat", err);
    }
  };

  useEffect(() => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const updatedTheme =
        document.documentElement.getAttribute("data-theme");
      setTheme(updatedTheme || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const logoSrc = theme === "dark" ? "/light-logo.png" : "/dark-logo.png";

  return (
    <div
      className="d-flex flex-column"
      style={{
        minWidth: "260px",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      <div className="p-3 ps-4 d-flex align-items-center justify-content-between">
        <BsLayoutSidebarInsetReverse
          style={{ cursor: "pointer", fontSize: "22px" }}
          onClick={onClose}
        />
        <div className="d-flex gap-3 ms-auto">
          <BiSearch
            style={{ cursor: "pointer", fontSize: "24px", marginTop: "1px" }}
            onClick={() => console.log("Search clicked")}
          />
          <BiEdit
            style={{ cursor: "pointer", fontSize: "24px" }}
            onClick={handleNewChat}
          />
        </div>
      </div>

      <div className="ps-4 pe-3 py-2 d-flex align-items-center gap-2 fw-bold">
        <img src={logoSrc} alt="logo" width={26} height={26} />
        <span>ChaatGPT</span>
      </div>

      <div className="overflow-auto flex-grow-1 ps-4 pe-3 py-1">
        {Object.keys(groupedChats).length === 0 ? (
          <div className="text-muted small mt-3">
            No chats yet. Start a new one!
          </div>
        ) : (
          Object.entries(groupedChats).map(([label, chats]) => (
            <div key={label} className="mb-3">
              <div
                className="small mb-2"
                style={{ color: "var(--muted-color)" }}
              >
                {label}
              </div>
              {chats.map((chat) => {
                const isActive = pathname.includes(chat._id);
                return (
                  <div
                    key={chat._id}
                    className={`rounded-3 px-2 py-2 ${
                      isActive ? "chat-active" : "chat-hover"
                    }`}
                    style={{
                      cursor: "pointer",
                      color: "var(--text-color)",
                    }}
                    onClick={() => router.push(`/chat/${chat._id}`)}
                  >
                    {chat.title || "Untitled"}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}