"use client";

import { useRef, useState } from "react";
import type { ZenReply } from "@/lib/zen";

interface Message {
  id: string;
  role: "user" | "zen";
  text: string;
  breath?: string;
}

const SUGGESTIONS = [
  "I feel stressed about my exams",
  "Help me focus",
  "I can't sleep",
  "Thank you",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "zen",
      text: "Welcome to TKU Zen AI. Take a breath, and share whatever is on your mind.",
      breath: "Inhale calm, exhale tension — three times.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const nextId = (prefix: string) => {
    idRef.current += 1;
    return `${prefix}-${idRef.current}`;
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: nextId("u"),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data: { reply?: ZenReply; error?: string } = await res.json();

      const zenMessage: Message = {
        id: nextId("z"),
        role: "zen",
        text: data.reply?.message ?? data.error ?? "The silence offers no words.",
        breath: data.reply?.breath,
      };
      setMessages((prev) => [...prev, zenMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId("e"),
          role: "zen",
          text: "I could not reach the still pond just now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-4">
      <header className="flex items-center gap-3 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-xl shadow-lg shadow-emerald-500/20">
          <span aria-hidden>🧘</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-stone-100">
            TKU Zen AI
          </h1>
          <p className="text-sm text-stone-400">A calm companion for a busy mind</p>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-3 text-stone-50 shadow"
                  : "max-w-[80%] rounded-2xl rounded-bl-sm bg-stone-800/80 px-4 py-3 text-stone-100 shadow ring-1 ring-white/5"
              }
            >
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              {m.breath && (
                <p className="mt-2 border-t border-white/10 pt-2 text-sm italic text-emerald-300">
                  🌬 {m.breath}
                </p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-stone-800/80 px-4 py-3 text-stone-400 ring-1 ring-white/5">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
              </span>
            </div>
          </div>
        )}
        <div ref={listEndRef} />
      </main>

      <div className="flex flex-wrap gap-2 pb-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            disabled={loading}
            className="rounded-full border border-white/10 bg-stone-800/50 px-3 py-1.5 text-sm text-stone-300 transition hover:border-emerald-500/50 hover:text-emerald-300 disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="sticky bottom-0 flex gap-2 border-t border-white/10 bg-stone-950/80 py-4 backdrop-blur"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share what's on your mind…"
          aria-label="Message"
          className="flex-1 rounded-full border border-white/10 bg-stone-900 px-5 py-3 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-emerald-500/60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
