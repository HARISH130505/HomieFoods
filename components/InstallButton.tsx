"use client";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!prompt) return;
    prompt.prompt();
    const result = await prompt.userChoice;
    console.log("User response:", result.outcome);
    setPrompt(null);
  };

  if (!prompt) return null;

  return (
    <button
      onClick={installApp}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#f97316",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 20px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      Install App
    </button>
  );
}
