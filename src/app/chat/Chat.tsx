"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  sender: "user" | "ai";
  message: string;
  timestamp: number;
};


export default function Chat() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  const IN_DEBUG_MODE = BACKEND_URL?.includes("localhost")
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Setup WebSocket
    const WEBSOCKET_URL = IN_DEBUG_MODE ? `ws://${BACKEND_URL}/ws` : `wss://${BACKEND_URL}/ws`
    const socket = new WebSocket(WEBSOCKET_URL);
    
    ws.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const aiMessage: ChatMessage = {
        sender: "ai",
        message: event.data,
        timestamp: Date.now(),
      };
      setSessionMessages((prev) => [...prev, aiMessage]);
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    console.log("sending message")
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const userMsg: ChatMessage = {
      sender: "user",
      message: input,
      timestamp: Date.now(),
    };

    ws.current.send(input);
    setSessionMessages((prev) => [...prev, userMsg]);
    setInput("");
  };

  useEffect(() => {
    const toggleOnHotkey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", toggleOnHotkey);
    return () => window.removeEventListener("keydown", toggleOnHotkey);
  }, []);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", bottom: "1rem", right: "1rem",
      background: "white", border: "1px solid #ccc",
      padding: "1rem", borderRadius: "0.5rem",
      width: "400px", maxHeight: "90vh", overflowY: "auto", zIndex: 9999
    }}>

      <div style={{ marginBottom: "1rem", maxHeight: "200px", overflowY: "auto" }}>
        {sessionMessages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left" }}>
            <span><strong>{m.sender}:</strong> {m.message}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
