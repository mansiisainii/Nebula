"use client";

import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import CosmicOrb from "./CosmicOrb";
import { soundFx } from "@/app/utils/audio";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectSuggestion: (suggestion: string) => void;
  orbState: "idle" | "listening" | "thinking" | "speaking";
}

export default function ChatView({
  messages,
  isLoading,
  onSelectSuggestion,
  orbState,
}: ChatViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef(messages.length);

  // Force scroll to top on mount so the orb and greeting are displayed first
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  // Auto-scroll ONLY when a new message is appended
  useEffect(() => {
    if (messages.length > prevCountRef.current || isLoading) {
      prevCountRef.current = messages.length;
      scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Text-to-speech speaker
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  // Copy message
  const copyMessage = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="w-full flex-1 overflow-y-auto px-4 py-1 pb-4 space-y-3.5 scrollbar-thin scrollbar-thumb-cyan-900/30"
    >
      {/* 1. Center Hero Section: Holographic Cosmic Orb */}
      <div className="flex flex-col items-center justify-center pt-1 pb-0 relative">
        <CosmicOrb state={orbState} compact={messages.length > 3} />

        {/* Status: NEBULA IS LISTENING */}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
          <span className="text-[11px] font-semibold tracking-[0.22em] text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]">
            {orbState === "thinking"
              ? "Nebula is Synthesizing"
              : orbState === "speaking"
              ? "Nebula is Transmitting"
              : "Nebula is Listening"}
          </span>
        </div>

        {/* Greeting: "How can I help you today?" */}
        <h1 className="text-xl sm:text-[22px] font-medium text-white tracking-tight mt-1 mb-1 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] text-center">
          How can I help you today?
        </h1>
      </div>

      {/* 2. Chat Messages Stream */}
      <div className="space-y-3 max-w-[540px] mx-auto w-full">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const isLast = index === messages.length - 1;

          return (
            <div key={msg.id} className="space-y-2">
              {/* Message Bubble Container */}
              <div className={`flex w-full ${isUser ? "justify-end" : "justify-start items-start gap-2.5"}`}>
                {/* AI Sparkle Avatar on Left */}
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#040f28] border border-cyan-400/80 shadow-[0_0_12px_rgba(56,189,248,0.7)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {/* Glowing 4-point radiant star */}
                    <svg className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_6px_#38bdf8]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                    </svg>
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`relative group max-w-[85%] sm:max-w-[80%] rounded-[18px] px-3.5 py-2.5 text-[14px] leading-relaxed transition-all ${
                    isUser
                      ? "bg-[#0c1c3f]/85 backdrop-blur-xl border border-cyan-400/55 shadow-[0_0_18px_rgba(14,165,233,0.25),inset_0_0_10px_rgba(56,189,248,0.08)] text-white"
                      : "bg-[#07132c]/80 backdrop-blur-xl border border-cyan-400/35 shadow-[0_0_16px_rgba(14,165,233,0.18)] text-slate-100"
                  }`}
                >
                  {/* Bubble Content */}
                  <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
                    {isUser ? (
                      <p className="m-0 text-white font-normal">{msg.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0 text-slate-100">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 text-cyan-100/90">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-cyan-100/90">{children}</ol>,
                          li: ({ children }) => <li className="text-slate-200">{children}</li>,
                          code: ({ children }) => (
                            <code className="bg-[#030a1c] border border-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">
                              {children}
                            </code>
                          ),
                          strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>

                  {/* Bubble Footer: Timestamp & Checkmarks / Action buttons */}
                  <div className="flex items-center justify-end gap-2 mt-2 pt-1 text-[11px] text-slate-400/80 select-none">
                    {/* Copy & Speak action buttons for AI message on hover */}
                    {!isUser && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 mr-auto">
                        <button
                          onClick={() => {
                            soundFx.playChipClick();
                            copyMessage(msg.content);
                          }}
                          title="Copy text"
                          className="hover:text-cyan-300 transition-colors p-0.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            soundFx.playChipClick();
                            speakText(msg.content);
                          }}
                          title="Read aloud"
                          className="hover:text-cyan-300 transition-colors p-0.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3-9H6a1 1 0 00-1 1v4a1 1 0 001 1h3l4 4V4L9 8z" />
                          </svg>
                        </button>
                      </div>
                    )}

                    <span>{msg.timestamp}</span>

                    {/* Blue checkmark for user messages */}
                    {isUser && (
                      <span className="text-cyan-400 font-bold text-xs tracking-tighter drop-shadow-[0_0_4px_#38bdf8]">
                        ✓✓
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestion Chips directly under Assistant message (matches screenshot) */}
              {!isUser && msg.suggestions && msg.suggestions.length > 0 && isLast && (
                <div className="flex flex-wrap gap-2 pl-10 pt-1 pb-1">
                  {msg.suggestions.map((chip, chipIdx) => (
                    <button
                      key={chipIdx}
                      onClick={() => {
                        soundFx.playChipClick();
                        onSelectSuggestion(chip);
                      }}
                      className="group/chip inline-flex items-center gap-1.5 rounded-full bg-[#08152e]/85 backdrop-blur-md border border-cyan-400/40 px-3.5 py-1.5 text-[13px] text-cyan-100 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_16px_rgba(56,189,248,0.45)] hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 cursor-pointer select-none"
                    >
                      <span>{chip}</span>
                      <span className="text-cyan-400 group-hover/chip:translate-x-0.5 transition-transform text-xs font-semibold">
                        &gt;
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Synthesizing Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 pl-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#040f28] border border-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.7)] flex items-center justify-center animate-spin-slow">
              <svg className="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            <div className="rounded-2xl bg-[#07132c]/80 border border-cyan-400/40 px-4 py-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-cyan-300/80 font-mono ml-2">Synthesizing...</span>
            </div>
          </div>
        )}

        {/* Status Indicator: 3 glowing cyan dots + "Ready to assist" */}
        <div className="flex flex-col items-center justify-center py-3 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] opacity-80" />
            <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8] opacity-100" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] opacity-80" />
          </div>
          <span className="text-[11px] font-medium tracking-wider text-slate-400/80 mt-2">
            Ready to assist
          </span>
        </div>

        <div ref={scrollEndRef} />
      </div>
    </div>
  );
}
