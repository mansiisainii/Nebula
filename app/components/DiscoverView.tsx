"use client";

import React from "react";
import { soundFx } from "@/app/utils/audio";

interface DiscoverViewProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function DiscoverView({ onSelectPrompt }: DiscoverViewProps) {
  const cards = [
    {
      category: "Productivity",
      title: "Deep Focus Routine",
      desc: "Engineer a high-output 90-minute deep work block with zero distractions.",
      prompt: "Help me design a 90-minute deep work protocol with focus triggers and break rituals.",
      gradient: "from-cyan-500/20 to-blue-600/10",
      accent: "#38bdf8",
    },
    {
      category: "Wellness",
      title: "Circadian Morning Alignment",
      desc: "Optimize natural cortisol awakening response and early morning energy.",
      prompt: "Help me plan a productive morning aligned with circadian rhythm and natural alertness.",
      gradient: "from-sky-500/20 to-indigo-600/10",
      accent: "#7dd3fc",
    },
    {
      category: "Strategic Thinking",
      title: "Decision Matrix Analysis",
      desc: "Weigh complex multi-variable decisions with first-principles reasoning.",
      prompt: "Act as my strategic advisor and walk me through a first-principles decision matrix.",
      gradient: "from-blue-500/20 to-purple-600/10",
      accent: "#60a5fa",
    },
    {
      category: "Creativity",
      title: "Lateral Thought Experiments",
      desc: "Unstick creative blocks through lateral associations and inventive angles.",
      prompt: "Give me 3 unexpected lateral perspectives on solving creative problems under constraints.",
      gradient: "from-teal-500/20 to-cyan-600/10",
      accent: "#2dd4bf",
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-4 pb-20 select-none space-y-4">
      {/* Title */}
      <div className="text-center py-2">
        <h2 className="text-xl font-semibold text-white drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]">
          Discover Nebula Intelligence
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore curated cognitive frameworks and specialized workflows.
        </p>
      </div>

      {/* Grid of discover cards */}
      <div className="grid grid-cols-1 gap-3.5">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => {
              soundFx.playChipClick();
              onSelectPrompt(card.prompt);
            }}
            className="group relative rounded-2xl bg-[#09152e]/80 backdrop-blur-xl border border-cyan-500/25 p-4 shadow-[0_0_15px_rgba(14,165,233,0.1)] hover:border-cyan-400/60 hover:shadow-[0_0_22px_rgba(56,189,248,0.25)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            {/* Top tag & arrow */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-wider uppercase font-semibold text-cyan-300/90 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                {card.category}
              </span>
              <span className="text-cyan-400/60 group-hover:text-cyan-300 transition-colors">
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>

            <h3 className="text-[15px] font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors">
              {card.title}
            </h3>
            <p className="text-[12.5px] text-slate-400 mt-1 leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
