"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const pathname = usePathname();

  const hiddenPages = ["/login", "/registration", "/"];
  const shouldHide = hiddenPages.some((page) => pathname === page);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! I’m FarmFriend Assistant. How can I help you today?",
    },
  ]);

  if (shouldHide) {
    return null;
  }

  const sendMessage = async () => {
    const userMessage = input.trim();

    if (!userMessage || loading) return;

    setMessages((previousMessages) => [
      ...previousMessages,
      { role: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5678/webhook/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatInput: userMessage,
          sessionId: "farmfriend-user-1",
        }),
      });

      const data = await response.json();

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "bot",
          text: data.output || "Sorry, I could not understand that.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "bot",
          text: "Chatbot is not available right now. Please make sure n8n is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: "28px",
            bottom: "100px",
            width: "360px",
            height: "500px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #d9ead3",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #064e3b, #16a34a)",
              color: "#ffffff",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>
                FarmFriend Assistant
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>
                Ask farming, marketplace, or crop questions
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "#ffffff",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: "14px",
              overflowY: "auto",
              backgroundColor: "#f6fbf3",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf:
                    message.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    message.role === "user" ? "#16a34a" : "#ffffff",
                  color: message.role === "user" ? "#ffffff" : "#1f2937",
                  padding: "10px 12px",
                  borderRadius:
                    message.role === "user"
                      ? "14px 14px 4px 14px"
                      : "14px 14px 14px 4px",
                  maxWidth: "82%",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#ffffff",
                  color: "#1f2937",
                  padding: "10px 12px",
                  borderRadius: "14px 14px 14px 4px",
                  fontSize: "14px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                Thinking...
              </div>
            )}
          </div>

          <div
            style={{
              padding: "12px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: "11px 12px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#86efac" : "#16a34a",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                padding: "0 16px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((previousState) => !previousState)}
        style={{
          position: "fixed",
          right: "28px",
          bottom: "28px",
          width: "62px",
          height: "62px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #064e3b, #16a34a)",
          color: "#ffffff",
          fontSize: "26px",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
        }}
        aria-label="Open chatbot"
      >
        💬
      </button>
    </>
  );
}
