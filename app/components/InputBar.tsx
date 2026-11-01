"use client";

import React, { useState, useRef, useEffect } from "react";
import { soundFx } from "@/app/utils/audio";

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onAttachFile?: () => void;
}

export default function InputBar({
  onSendMessage,
  isLoading,
  onAttachFile,
}: InputBarProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    // Initialize Web Speech Recognition if available in browser
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
          .SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown })
          .webkitSpeechRecognition;

      if (SpeechRecognition) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (SpeechRecognition as any)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    soundFx.playSendChime();
    onSendMessage(input.trim());
    setInput("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSpeech = () => {
    soundFx.playChipClick();
    if (!recognitionRef.current) {
      // Speech recognition not supported in this browser
      alert("Speech recognition is supported in Chrome, Edge, and Safari.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = recognitionRef.current as any;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech error:", err);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 pb-2 pt-1 select-none z-20 flex-shrink-0">
      {/* Floating Capsule Input Bar */}
      <div className="relative w-full max-w-[480px] h-[58px] rounded-full bg-[#081328]/85 backdrop-blur-xl border border-cyan-400/45 shadow-[0_0_24px_rgba(14,165,233,0.28),inset_0_0_12px_rgba(56,189,248,0.08)] flex items-center px-3 gap-2 transition-all duration-300 focus-within:border-cyan-300 focus-within:shadow-[0_0_30px_rgba(56,189,248,0.45)]">
        {/* Attachment / Paperclip button */}
        <button
          type="button"
          onClick={() => {
            soundFx.playChipClick();
            onAttachFile?.();
          }}
          title="Attach context or presets"
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors active:scale-95 flex-shrink-0"
        >
          {/* Tilted Paperclip SVG */}
          <svg
            className="w-5 h-5 -rotate-45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nebula anything..."
          disabled={isLoading}
          className="flex-1 bg-transparent text-white placeholder:text-slate-400/70 text-[15px] outline-none tracking-normal font-sans"
        />

        {/* Optional Mic Button */}
        <button
          type="button"
          onClick={toggleSpeech}
          title={isListening ? "Listening... click to stop" : "Voice input"}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            isListening
              ? "text-red-400 bg-red-950/40 animate-pulse border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
              : "text-slate-400 hover:text-cyan-300"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>

        {/* Glowing Circular Electric Blue Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          title="Send message"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 active:scale-95 ${
            input.trim() && !isLoading
              ? "bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] text-white shadow-[0_0_20px_rgba(56,189,248,0.85)] hover:shadow-[0_0_26px_rgba(56,189,248,1)] hover:scale-105 cursor-pointer"
              : "bg-cyan-950/60 text-cyan-400/50 border border-cyan-800/40 cursor-not-allowed opacity-60"
          }`}
        >
          {isLoading ? (
            /* Loading Spinner */
            <svg
              className="w-5 h-5 animate-spin text-cyan-200"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            /* Angled Paper Airplane Send Icon */
            <svg
              className="w-5 h-5 ml-0.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Powered by intelligent conversations footer text */}
      <div className="mt-2 text-center">
        <span className="text-[10px] tracking-wide text-slate-400/70 font-light select-none">
          Powered by intelligent conversations
        </span>
      </div>
    </div>
  );
}
