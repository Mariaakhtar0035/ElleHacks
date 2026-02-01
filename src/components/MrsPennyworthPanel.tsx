"use client";

import React, { useState, useRef, useEffect } from "react";
import { MrsPennyworthAvatar, type MrsPennyworthState } from "./MrsPennyworthAvatar";
import type { AskNarratorContext } from "@/lib/gemini";

const MAX_QUESTION_LENGTH = 200;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MrsPennyworthPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  studentName: string;
  context?: AskNarratorContext | null;
}

const WELCOME_MESSAGE = "Hi! I'm Mrs. Pennyworth 💬 I'm here to help you think about your tokens, saving, and spending. Ask me anything — I'll give you options, not orders! What's on your mind?";

export function MrsPennyworthPanel({
  isOpen,
  onClose,
  onToggle,
  studentName,
  context,
}: MrsPennyworthPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarState, setAvatarState] = useState<MrsPennyworthState>("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setAvatarState("thinking");

    try {
      const response = await fetch("/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          question: trimmed,
          context: context ?? undefined,
          recentMessages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get answer");

      const data = await response.json();
      const answer = data.answer ?? "I'm not sure right now. Ask your teacher or try again!";

      setAvatarState("celebration");
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      setTimeout(() => setAvatarState("encouraging"), 800);
      setTimeout(() => setAvatarState("idle"), 2500);
    } catch {
      setAvatarState("idle");
      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "I'm having a little trouble right now. Try asking your teacher, or give it another go in a moment!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Side panel - fixed, non-blocking */}
      <aside
        className={`
          fixed top-0 right-0 z-40 h-dvh w-[360px]
          bg-white/98 backdrop-blur-sm
          border-l-2 border-teal-200
          shadow-[-8px_0_24px_rgba(0,0,0,0.08)]
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ marginTop: 0 }}
        aria-label="Mrs. Pennyworth chat panel"
      >
        {/* Header with avatar */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-4 border-b border-teal-100 bg-linear-to-r from-teal-50/80 to-amber-50/50">
          <div className="flex items-center gap-3">
            <MrsPennyworthAvatar state={avatarState} size="lg" />
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900">
                Mrs. Pennyworth
              </h2>
              <p className="text-xs text-teal-700">Your financial guide</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="p-2 rounded-full hover:bg-teal-100 text-gray-600 hover:text-teal-800 transition-colors"
            aria-label="Collapse chat panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="shrink-0 pt-1">
                  <MrsPennyworthAvatar state="idle" size="sm" />
                </div>
              )}
              <div
                className={`
                  max-w-[85%] px-4 py-2.5 rounded-2xl text-sm
                  ${msg.role === "assistant"
                    ? "bg-teal-50/90 border border-teal-200/80 text-gray-800 rounded-tl-sm"
                    : "bg-slate-100 border border-slate-200 text-gray-800 rounded-tr-sm"
                  }
                `}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2">
              <div className="shrink-0 pt-1">
                <MrsPennyworthAvatar state="thinking" size="sm" />
              </div>
              <div className="bg-teal-50/90 border border-teal-200/80 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-teal-700 font-medium flex items-center gap-1">
                  Mrs. Pennyworth is thinking
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-typing-dot" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-typing-dot" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-typing-dot" style={{ animationDelay: "0.4s" }} />
                  </span>
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="shrink-0 p-4 border-t border-teal-100 bg-white"
        >
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_QUESTION_LENGTH))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Ask about tokens, saving, spending..."
              rows={2}
              maxLength={MAX_QUESTION_LENGTH}
              disabled={loading}
              className="
                flex-1 px-4 py-3 rounded-xl border-2 border-teal-200
                focus:border-teal-500 focus:ring-2 focus:ring-teal-200
                font-display text-sm resize-none
                disabled:opacity-60 disabled:cursor-not-allowed
              "
              aria-label="Your message"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="
                shrink-0 self-end px-4 py-3 rounded-xl
                bg-teal-500 text-white font-display font-bold text-sm
                hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
              aria-label="Send message"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {input.length}/{MAX_QUESTION_LENGTH}
          </p>
        </form>
      </aside>

      {/* Optional: semi-transparent overlay when panel is open - but we DON'T want to block clicks.
          Per requirements: "Never block clicks on the main app". So we skip the overlay. */}
    </>
  );
}
