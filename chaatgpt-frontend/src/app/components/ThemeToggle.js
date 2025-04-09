// components/ThemeToggle.js
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  const icon = theme === "dark" ? "/dark-toggle.png" : "/toggle.png";

  return (
    <Image
      src={icon}
      alt="Theme Toggle"
      width={28}
      height={28}
      style={{ cursor: "pointer" }}
      onClick={toggleTheme}
    />
  );
}
