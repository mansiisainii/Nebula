"use client";

import React from "react";
import { soundFx } from "@/app/utils/audio";

interface SavedViewProps {
  onLoadRoutine: (text: string) => void;
}

export default function SavedView({ onLoadRoutine }: SavedViewProps) {
  const savedItems = [
    {
      title: "Optimized Morning Routine",
      time: "Saved yesterday",
      snippet: "Wake at 6:30 AM → 500ml water with electrolytes → 10 min sunlight exposure → 45 min deep work sprint.",
      prompt: "Give me the step-by-step breakdown of the 6:30 AM optimized morning routine.",
    },
    {
      title: "Focus Techniques: 25/5 Pomodoro & Flow Triggers",
      time: "Saved 3 days ago",
      snippet: "Binaural alpha waves (10Hz) + noise isolation + pre-commit single task rule.",
      prompt: "Explain how to combine binaural alpha waves with 25/5 focus intervals for maximum flow state.",
    },
    {
      title: "Evening Digital Sunset Protocol",
      time: "Saved last week",
      snippet: "Screen dimming 90 min before sleep, gratitude reflection, 3 priority goals locked for tomorrow.",
      prompt: "Summarize the evening digital sunset protocol for deep restorative sleep.",
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-4 pb-20 select-none space-y-4">
      <div className="text-center py-2">
        <h2 className="text-xl font-semibold text-white drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]">
          Saved Intelligence
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Your bookmarked routines, summaries, and breakthrough insights.
        </p>
      </div>

      <div className="space-y-3">
        {savedItems.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#09152e]/80 backdrop-blur-xl border border-cyan-500/25 p-4 shadow-[0_0_15px_rgba(14,165,233,0.1)] hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[14px] font-semibold text-slate-100 flex items-center gap-2">
                <span className="text-cyan-400">★</span>
                {item.title}
              </span>
              <span className="text-[11px] text-slate-500">{item.time}</span>
            </div>
            <p className="text-[12.5px] text-slate-300/80 leading-relaxed bg-[#050c1f]/60 p-2.5 rounded-xl border border-cyan-500/10 mt-2 font-mono text-xs">
              {item.snippet}
            </p>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => {
                  soundFx.playChipClick();
                  onLoadRoutine(item.prompt);
                }}
                className="text-xs text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Ask Nebula</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
