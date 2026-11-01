"use client";

import React from "react";
import { soundFx } from "@/app/utils/audio";

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClearChat?: () => void;
  onOpenSettings?: () => void;
}

export default function Header({
  soundEnabled,
  onToggleSound,
  onClearChat,
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className="relative w-full pt-4 sm:pt-6 pb-2 px-5 flex items-center justify-between z-30 select-none flex-shrink-0">
      {/* Top Laser Flare Edge */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />

      {/* Left: Nebula Spark Glyph / Brand Icon */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearChat}
          title="New Chat Session"
          className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-950/40 border border-cyan-500/20 transition-all active:scale-95 group"
        >
          {/* 4-point radiant star */}
          <svg
            className="w-4 h-4 transition-transform group-hover:rotate-45"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </button>
      </div>

      {/* Center: "PERSONAL INTELLIGENCE" */}
      <div className="flex flex-col items-center">
        <span className="text-[10.5px] sm:text-[11.5px] font-medium tracking-[0.22em] uppercase text-cyan-200/90 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
          Personal Intelligence
        </span>
      </div>

      {/* Right: Sound FX toggle & Options */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            soundFx.playChipClick();
            onToggleSound();
          }}
          title={soundEnabled ? "Mute Nebula sounds" : "Enable Nebula sounds"}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
            soundEnabled
              ? "text-cyan-300 border-cyan-500/40 bg-cyan-950/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
              : "text-slate-500 border-slate-700/50 hover:text-slate-300"
          }`}
        >
          {soundEnabled ? (
            /* Audio wave icon */
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          ) : (
            /* Muted icon */
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          )}
        </button>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-200 border border-cyan-500/10 hover:border-cyan-500/30 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
              />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
