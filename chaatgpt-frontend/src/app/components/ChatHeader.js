"use client";

import { useEffect, useState } from "react";
import { LiaToggleOnSolid, LiaToggleOffSolid } from "react-icons/lia";
import { BsLayoutSidebarInset } from "react-icons/bs";

export default function ChatHeader({ onToggleSidebar, showToggle = true }) {
  const [theme, setTheme] = useState("light");

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

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <div
      className="chat-header px-4 d-flex align-items-center justify-content-between"
      style={{
        backgroundColor: "var(--secondary-color)",
        color: "var(--text-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="d-flex align-items-center">
        {showToggle && (
          <BsLayoutSidebarInset
            onClick={onToggleSidebar}
            style={{ fontSize: "22px", cursor: "pointer", marginRight: "10px" }}
          />
        )}
        <span className="mb-0 fw-bold">ChaatGPT</span>
      </div>

      {theme === "dark" ? (
        <LiaToggleOnSolid
          size={28}
          onClick={handleThemeToggle}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <LiaToggleOffSolid
          size={28}
          onClick={handleThemeToggle}
          style={{ cursor: "pointer" }}
        />
      )}
    </div>
  );
}
