"use client";

import { useEffect, useState } from "react";

type ChatMessage = {
  sender: "user" | "ai";
  message: string;
  timestamp: number;
};

export default function AllMessages() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    console.log('BACKEND_URL', BACKEND_URL)
    const IN_DEBUG_MODE = BACKEND_URL?.includes("localhost")
    const HTTP_PREFIX = IN_DEBUG_MODE ? 'http://' : 'https://'
    const [messages, setMessages] = useState<ChatMessage[]>([]);
  useEffect(() => {
    // Poll /history every 5 seconds
    const fetchMessages = async () => {
        try {
            const res = await fetch(`${HTTP_PREFIX}${BACKEND_URL}/history`);
            const data: ChatMessage[] = await res.json();
            data.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(data);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    fetchMessages(); // initial fetch
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "0.5rem", marginBottom: "1rem" }}>
      <h2>🔁 All Messages (Bigtable)</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left" }}>
            <span><strong>{m.sender}:</strong> {m.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
