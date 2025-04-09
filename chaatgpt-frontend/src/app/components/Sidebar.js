"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { BiEdit, BiSearch } from "react-icons/bi";
import { groupChatsByDate } from "./functions";

const chatList = [
  { id: "chat1", title: "My First Chat", date: "2025-04-07T10:15:00" },
  { id: "chat2", title: "Shopping Ideas", date: "2025-04-06T15:30:00" },
  { id: "chat3", title: "Old Notes", date: "2025-03-28T09:00:00" },
];

export default function Sidebar({ onClose }) {
  const [theme, setTheme] = useState("light");
  const [groupedChats, setGroupedChats] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  const handleNewChat = () => {
    const newId = "chat" + Date.now();
    router.push(`/chat/${newId}`);
  };

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const updatedTheme = document.documentElement.getAttribute("data-theme");
      setTheme(updatedTheme || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const grouped = groupChatsByDate(chatList);
    setGroupedChats(grouped);
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
        {Object.entries(groupedChats).map(([label, chats]) => (
          <div key={label} className="mb-3">
            <div className="small mb-2" style={{ color: "var(--muted-color)" }}>
              {label}
            </div>
            {chats.map((chat) => {
              const isActive = pathname.includes(chat.id);
              return (
                <div
                  key={chat.id}
                  className={`rounded-3 px-2 py-2 ${isActive ? "chat-active" : "chat-hover"}`}
                  style={{
                    cursor: "pointer",
                    color: "var(--text-color)",
                  }}
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  {chat.title}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
