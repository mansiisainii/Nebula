"use client";

import React from "react";
import { soundFx } from "@/app/utils/audio";

interface ProfileViewProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClearHistory: () => void;
}

export default function ProfileView({
  soundEnabled,
  onToggleSound,
  onClearHistory,
}: ProfileViewProps) {
  return (
    <div className="w-full h-full overflow-y-auto px-4 py-4 pb-20 select-none space-y-4">
      {/* Header Profile Badge */}
      <div className="flex flex-col items-center py-3">
        <div className="relative w-18 h-18 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-400 p-[2px] shadow-[0_0_25px_rgba(56,189,248,0.6)]">
          <div className="w-full h-full rounded-full bg-[#050e22] flex items-center justify-center">
            {/* Holographic user silhouette */}
            <svg className="w-8 h-8 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-5.33 0-8 2.67-8 6v2h16v-2c0-3.33-2.67-6-8-6z" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#050e22] shadow-[0_0_8px_#34d399]" />
        </div>
        <h2 className="text-lg font-semibold text-white mt-2.5 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
          Nebula Operative
        </h2>
        <span className="text-xs text-cyan-300/80 tracking-widest uppercase mt-0.5">
          Neural Uplink: Connected
        </span>
      </div>

      {/* System Status Card */}
      <div className="rounded-2xl bg-[#09152e]/80 backdrop-blur-xl border border-cyan-500/25 p-4 space-y-2.5">
        <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300 flex items-center justify-between">
          <span>AI Intelligence Engine</span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-[#050c1f]/70 p-2.5 rounded-xl border border-cyan-500/10">
            <span className="text-slate-400 block text-[11px]">Primary Model</span>
            <span className="text-slate-200 font-medium font-mono text-[12px]">Gemini Flash 2.5</span>
          </div>
          <div className="bg-[#050c1f]/70 p-2.5 rounded-xl border border-cyan-500/10">
            <span className="text-slate-400 block text-[11px]">Architecture</span>
            <span className="text-slate-200 font-medium font-mono text-[12px]">Multimodal API</span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl bg-[#09152e]/80 backdrop-blur-xl border border-cyan-500/25 p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Preferences & Audio
        </h3>

        {/* Audio Toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-sm font-medium text-slate-200">Cosmic Audio Effects</div>
            <div className="text-xs text-slate-400">Synthesized response & transmission chimes</div>
          </div>
          <button
            onClick={() => {
              soundFx.playChipClick();
              onToggleSound();
            }}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              soundEnabled ? "bg-cyan-500 justify-end" : "bg-slate-700 justify-start"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Clear Conversation */}
        <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-200">Conversation Memory</div>
            <div className="text-xs text-slate-400">Clear all active messages and reset orb state</div>
          </div>
          <button
            onClick={() => {
              soundFx.playChipClick();
              onClearHistory();
            }}
            className="text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
