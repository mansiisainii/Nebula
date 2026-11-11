"use client";

import React, { useState } from "react";
import Header from "./components/Header";
import ChatView, { ChatMessage } from "./components/ChatView";
import InputBar from "./components/InputBar";
import BottomNav, { NavTab } from "./components/BottomNav";
import DiscoverView from "./components/DiscoverView";
import SavedView from "./components/SavedView";
import ProfileView from "./components/ProfileView";
import { generateChatAction } from "./actions/aiActions";
import { soundFx } from "./utils/audio";

// Initial seed conversation matching the screenshot
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "initial-user",
    role: "user",
    content: "Help me plan a productive morning.",
    timestamp: "10:24 AM",
  },
  {
    id: "initial-ai",
    role: "assistant",
    content:
      "Absolutely. Let's build a morning routine that helps you feel focused and energized.",
    timestamp: "10:24 AM",
    suggestions: ["Morning routine", "Focus techniques", "Daily goals"],
  },
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [activeTab, setActiveTab] = useState<NavTab>("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [orbState, setOrbState] = useState<"idle" | "listening" | "thinking" | "speaking">("listening");
  const [isExpanded, setIsExpanded] = useState(true);
  const [attachModalOpen, setAttachModalOpen] = useState(false);

  // Helper to format current time like 10:24 AM
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setOrbState("listening");
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setOrbState("thinking");

    try {
      // Build history for Gemini
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await generateChatAction(historyPayload, text);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: res.text,
        timestamp: getCurrentTime(),
        suggestions: res.suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
      soundFx.playReceiveChime();
      setOrbState("speaking");

      setTimeout(() => {
        setOrbState("listening");
      }, 2500);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "I encountered a synchronization error with the neural network. Please retry.",
          timestamp: getCurrentTime(),
          suggestions: ["Retry question", "Plan morning routine", "Daily goals"],
        },
      ]);
      setOrbState("listening");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    // If suggestion ends with >, clean it
    const clean = suggestion.replace(/>$/, "").trim();
    handleSendMessage(clean);
  };

  const handleLoadFromSaved = (prompt: string) => {
    setActiveTab("chat");
    handleSendMessage(prompt);
  };

  return (
    <div className="w-screen h-screen min-h-screen bg-[#01040a] text-slate-100 flex items-center justify-center relative overflow-hidden select-none">
      {/* Outer ambient cosmic lighting (visible around the frame on desktop) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/30 via-[#01040a] to-[#01040a] z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Desktop view-mode switcher (toggle handheld frame vs full-bleed) */}
      <div className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-2 bg-[#08152e]/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-full text-xs text-cyan-200 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
        <span>Frame:</span>
        <button
          onClick={() => setIsExpanded(false)}
          className={`px-2 py-0.5 rounded-full transition-colors ${
            !isExpanded ? "bg-cyan-500/30 text-white font-medium" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Device (Theme)
        </button>
        <button
          onClick={() => setIsExpanded(true)}
          className={`px-2 py-0.5 rounded-full transition-colors ${
            isExpanded ? "bg-cyan-500/30 text-white font-medium" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Expanded
        </button>
      </div>

      {/* Main Handheld Device / App Container */}
      <main
        className={`relative z-10 w-full flex flex-col justify-between cosmic-bg overflow-hidden transition-all duration-300 ${
          isExpanded
            ? "max-w-7xl h-screen border-x border-cyan-500/20 shadow-[0_0_80px_rgba(14,165,233,0.15)]"
            : "max-w-[420px] h-[100dvh] sm:h-[88vh] sm:max-h-[860px] sm:rounded-[44px] sm:border sm:border-cyan-400/40 sm:shadow-[0_0_60px_rgba(14,165,233,0.35),0_0_120px_rgba(2,132,199,0.2)]"
        }`}
      >
        {/* Device Top Speaker / Dynamic Island Notch (visible on framed desktop) */}
        {!isExpanded && (
          <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-3.5 rounded-full bg-[#030816] border border-cyan-500/20 items-center justify-center z-40">
            <div className="w-8 h-1 rounded-full bg-slate-700/60" />
            <div className="w-2 h-2 rounded-full bg-cyan-900/60 ml-2" />
          </div>
        )}

        {/* 1. Header */}
        <Header
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onClearChat={handleClearChat}
          onOpenSettings={() => setActiveTab("profile")}
        />

        {/* 2. Middle Content Area based on Active Tab */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col relative z-10">
          {activeTab === "chat" && (
            <ChatView
              messages={messages}
              isLoading={isLoading}
              onSelectSuggestion={handleSelectSuggestion}
              orbState={orbState}
            />
          )}

          {activeTab === "discover" && (
            <DiscoverView onSelectPrompt={handleLoadFromSaved} />
          )}

          {activeTab === "saved" && (
            <SavedView onLoadRoutine={handleLoadFromSaved} />
          )}

          {activeTab === "profile" && (
            <ProfileView
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onClearHistory={handleClearChat}
            />
          )}
        </div>

        {/* 3. Input Bar (Only visible on Chat Tab) */}
        {activeTab === "chat" && (
          <InputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onAttachFile={() => setAttachModalOpen(true)}
          />
        )}

        {/* 4. Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </main>

      {/* Attachment Context Modal */}
      {attachModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#08152e] border border-cyan-400/50 p-5 shadow-[0_0_30px_rgba(56,189,248,0.4)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <span className="text-cyan-400">📎</span> Attach Context
              </h3>
              <button
                onClick={() => setAttachModalOpen(false)}
                className="w-7 h-7 rounded-full bg-cyan-950/50 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Select a quick cognitive template or context preset to feed into Nebula:
            </p>
            <div className="space-y-2">
              {[
                {
                  title: "Productive Morning Routine Protocol",
                  text: "Attach my daily schedule: Wake at 6:30 AM, gym at 7:00 AM, first deep work sprint at 9:00 AM.",
                },
                {
                  title: "Focus Block & Task Priority List",
                  text: "Attach my high-priority tasks: 1) Architecture refactoring, 2) Client briefing deck, 3) Review metrics.",
                },
                {
                  title: "Daily Cognitive Reflection",
                  text: "Attach evening reflection questions: What went well today? What caused friction? How can tomorrow be 1% better?",
                },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendMessage(preset.text);
                    setAttachModalOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-[#040e24] hover:bg-cyan-950/50 border border-cyan-500/20 hover:border-cyan-400/50 text-xs text-slate-200 transition-all flex flex-col gap-1 cursor-pointer"
                >
                  <span className="font-semibold text-cyan-300">{preset.title}</span>
                  <span className="text-slate-400 line-clamp-1">{preset.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
