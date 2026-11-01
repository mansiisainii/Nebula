"use client";

import React from "react";
import { soundFx } from "@/app/utils/audio";

export type NavTab = "chat" | "discover" | "saved" | "profile";

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs: { id: NavTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    {
      id: "chat",
      label: "Chat",
      icon: (active) => (
        <svg
          className={`w-6 h-6 transition-all ${
            active
              ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.85)] scale-105"
              : "text-slate-400 group-hover:text-slate-200"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
    {
      id: "discover",
      label: "Discover",
      icon: (active) => (
        <svg
          className={`w-6 h-6 transition-all ${
            active
              ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.85)] scale-105"
              : "text-slate-400 group-hover:text-slate-200"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
    {
      id: "saved",
      label: "Saved",
      icon: (active) => (
        <svg
          className={`w-6 h-6 transition-all ${
            active
              ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.85)] scale-105"
              : "text-slate-400 group-hover:text-slate-200"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (active) => (
        <svg
          className={`w-6 h-6 transition-all ${
            active
              ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.85)] scale-105"
              : "text-slate-400 group-hover:text-slate-200"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="relative w-full h-[68px] bg-[#030919]/90 backdrop-blur-2xl border-t border-cyan-500/30 shadow-[0_-6px_24px_rgba(14,165,233,0.18)] flex items-center justify-around px-4 select-none z-30 flex-shrink-0">
      {/* Top curved neon rim shine */}
      <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-3/4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_8px_#38bdf8]" />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playChipClick();
              onChangeTab(tab.id);
            }}
            className="group flex flex-col items-center justify-center py-1 px-3 relative transition-all active:scale-95"
          >
            {tab.icon(isActive)}
            <span
              className={`text-[11px] mt-1 transition-colors font-medium ${
                isActive
                  ? "text-cyan-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]"
                  : "text-slate-400/80 group-hover:text-slate-200"
              }`}
            >
              {tab.label}
            </span>

            {/* Glowing Active Dot indicator */}
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
