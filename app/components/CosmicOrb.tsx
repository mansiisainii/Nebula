"use client";

import React, { useEffect, useRef } from "react";

interface CosmicOrbProps {
  state?: "idle" | "listening" | "thinking" | "speaking";
  compact?: boolean;
  onClick?: () => void;
}

export default function CosmicOrb({
  state = "listening",
  compact = false,
  onClick,
}: CosmicOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const width = compact ? 90 : 165;
    const height = compact ? 90 : 165;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Cosmic stardust particles inside/around the sphere
    const particleCount = compact ? 16 : 30;
    const particles = Array.from({ length: particleCount }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: (Math.random() * 0.45 + 0.1) * (width / 2),
      speed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      time += state === "thinking" ? 0.045 : state === "listening" ? 0.025 : 0.015;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = (width / 2) * 0.78;

      // 1. Deep outer atmospheric glow
      const outerGlow = ctx.createRadialGradient(cx, cy, maxR * 0.3, cx, cy, maxR * 1.35);
      outerGlow.addColorStop(0, "rgba(56, 189, 248, 0.45)");
      outerGlow.addColorStop(0.35, "rgba(14, 165, 233, 0.25)");
      outerGlow.addColorStop(0.7, "rgba(2, 132, 199, 0.12)");
      outerGlow.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Swirling Nebula Plasma Layers
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.clip();

      // Base deep cosmic sphere
      const sphereBase = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      sphereBase.addColorStop(0, "#ffffff");
      sphereBase.addColorStop(0.18, "#7dd3fc");
      sphereBase.addColorStop(0.42, "#0284c7");
      sphereBase.addColorStop(0.75, "#072047");
      sphereBase.addColorStop(1, "#020719");
      ctx.fillStyle = sphereBase;
      ctx.fillRect(0, 0, width, height);

      // Swirling plasma filaments
      const waves = 4;
      for (let i = 0; i < waves; i++) {
        const angleOffset = (i * Math.PI) / waves + time * 0.6;
        const waveGrad = ctx.createRadialGradient(
          cx + Math.cos(angleOffset) * (maxR * 0.35),
          cy + Math.sin(angleOffset) * (maxR * 0.35),
          maxR * 0.05,
          cx,
          cy,
          maxR * 0.95
        );
        waveGrad.addColorStop(0, "rgba(224, 242, 254, 0.6)");
        waveGrad.addColorStop(0.25, "rgba(56, 189, 248, 0.4)");
        waveGrad.addColorStop(0.65, "rgba(14, 165, 233, 0.15)");
        waveGrad.addColorStop(1, "transparent");

        ctx.fillStyle = waveGrad;
        ctx.beginPath();
        ctx.arc(
          cx + Math.sin(time + i) * 4,
          cy + Math.cos(time + i) * 4,
          maxR * (0.65 + Math.sin(time * 0.8 + i) * 0.1),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Internal luminous vortex rings
      for (let j = 0; j < 3; j++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * (0.8 + j * 0.3) * (j % 2 === 0 ? 1 : -1));
        const arcGrad = ctx.createLinearGradient(-maxR * 0.6, 0, maxR * 0.6, 0);
        arcGrad.addColorStop(0, "transparent");
        arcGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.7)");
        arcGrad.addColorStop(1, "rgba(56, 189, 248, 0.6)");
        ctx.strokeStyle = arcGrad;
        ctx.lineWidth = 2 + j * 0.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, maxR * 0.55, maxR * 0.28, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Sparkling particles inside sphere
      particles.forEach((p) => {
        p.angle += p.speed;
        const currentR = p.radius + Math.sin(time * 2 + p.angle) * 3;
        const px = cx + Math.cos(p.angle) * currentR;
        const py = cy + Math.sin(p.angle) * (currentR * 0.8);
        const pAlpha = p.alpha + Math.sin(time * 3 + p.angle) * 0.2;

        ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.1, Math.min(1, pAlpha))})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Brilliant hot white-cyan core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.45);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGrad.addColorStop(0.2, "rgba(186, 230, 253, 0.85)");
      coreGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.45)");
      coreGrad.addColorStop(1, "rgba(2, 132, 199, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Rim glass highlight
      const rimGrad = ctx.createRadialGradient(cx, cy, maxR * 0.85, cx, cy, maxR);
      rimGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
      rimGrad.addColorStop(0.8, "rgba(56, 189, 248, 0.4)");
      rimGrad.addColorStop(1, "rgba(186, 230, 253, 0.9)");
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 3. Crisp outer neon border
      ctx.strokeStyle = "rgba(125, 211, 252, 0.75)";
      ctx.lineWidth = 1.2;
      ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, compact]);

  // Subtle 3D tilt tracking cursor on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (compact || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    containerRef.current.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.transform = `perspective(600px) rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center justify-center select-none transition-transform duration-300 ease-out cursor-pointer ${
        compact ? "w-[100px] h-[100px]" : "w-[175px] h-[175px]"
      }`}
      aria-label="Nebula AI Core"
    >
      {/* Horizontal top laser flare streak */}
      {!compact && (
        <div className="absolute top-[16%] left-[-20%] right-[-20%] h-[2px] pointer-events-none z-20 flex items-center justify-center">
          <div className="w-full h-[1.2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent blur-[0.5px]" />
          <div className="absolute w-20 h-1 bg-cyan-300 blur-sm animate-pulse" />
          <div className="absolute w-2.5 h-2.5 bg-white rounded-full blur-[0.5px] shadow-[0_0_10px_#38bdf8]" />
        </div>
      )}

      {/* SVG 3D Orbital Rings Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        viewBox="0 0 200 200"
        fill="none"
      >
        <defs>
          <linearGradient id="ringGlowA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="ringGlowB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.9" />
          </linearGradient>
          <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Primary inclined orbital ring */}
        <g transform="translate(100, 100) rotate(-26)">
          <ellipse
            cx="0"
            cy="0"
            rx="92"
            ry="30"
            stroke="url(#ringGlowA)"
            strokeWidth="1.5"
            filter="url(#neonBlur)"
            className="animate-spin-slow opacity-90"
            style={{ animationDuration: "18s" }}
          />
          {/* Orbital satellite spark 1 */}
          <circle cx="82" cy="-12" r="2.5" fill="#ffffff" filter="url(#neonBlur)">
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Secondary counter orbital ring */}
        <g transform="translate(100, 100) rotate(32)">
          <ellipse
            cx="0"
            cy="0"
            rx="96"
            ry="26"
            stroke="url(#ringGlowB)"
            strokeWidth="1.2"
            strokeDasharray="5 2"
            filter="url(#neonBlur)"
            className="opacity-75"
          />
          <circle cx="-86" cy="11" r="2" fill="#bae6fd" filter="url(#neonBlur)" />
        </g>

        {/* Outer subtle orbital faint ring */}
        <g transform="translate(100, 100) rotate(5)">
          <ellipse
            cx="0"
            cy="0"
            rx="102"
            ry="48"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="0.8"
          />
        </g>

        {/* Floating stardust 4-point radiant sparkle stars around the orb */}
        {!compact && (
          <>
            <g transform="translate(32, 38)" className="animate-pulse">
              <path
                d="M 0 -5 Q 0 0 5 0 Q 0 0 0 5 Q 0 0 -5 0 Q 0 0 0 -5"
                fill="#ffffff"
                opacity="0.8"
                filter="url(#neonBlur)"
              />
            </g>
            <g transform="translate(172, 60)" className="animate-pulse" style={{ animationDelay: "1s" }}>
              <path
                d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4"
                fill="#7dd3fc"
                opacity="0.85"
                filter="url(#neonBlur)"
              />
            </g>
            <g transform="translate(42, 150)" className="animate-pulse" style={{ animationDelay: "1.8s" }}>
              <circle cx="0" cy="0" r="1.5" fill="#bae6fd" opacity="0.9" />
            </g>
            <g transform="translate(158, 140)" className="animate-pulse" style={{ animationDelay: "0.6s" }}>
              <circle cx="0" cy="0" r="2" fill="#38bdf8" opacity="0.75" />
            </g>
          </>
        )}
      </svg>

      {/* HTML5 Canvas Plasma Sphere Core */}
      <canvas
        ref={canvasRef}
        className={`rounded-full z-1 relative transition-all duration-500 ${
          state === "thinking"
            ? "scale-105 shadow-[0_0_45px_rgba(56,189,248,0.7)]"
            : state === "listening"
            ? "scale-100 shadow-[0_0_35px_rgba(14,165,233,0.55)]"
            : "scale-98 shadow-[0_0_25px_rgba(14,165,233,0.35)]"
        }`}
      />

      {/* Holographic Pedestal Dais / Floor Projection Pad */}
      {!compact && (
        <div className="absolute -bottom-5 w-[180px] h-[50px] pointer-events-none flex items-center justify-center">
          {/* Floor Light Cone Wash */}
          <div className="absolute bottom-4 w-32 h-16 bg-gradient-to-t from-cyan-500/25 via-cyan-500/10 to-transparent blur-md" />

          {/* Perspective Concentric Projector Rings on Ground Plane */}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ transform: "perspective(300px) rotateX(72deg)" }}
          >
            {/* Outer faint floor ring */}
            <div className="absolute w-[160px] h-[160px] rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(14,165,233,0.2)]" />
            {/* Middle glowing floor ring */}
            <div className="absolute w-[120px] h-[120px] rounded-full border border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.4)] animate-pulse" />
            {/* Inner pedestal core */}
            <div className="absolute w-[75px] h-[75px] rounded-full bg-cyan-400/20 border border-cyan-300/80 shadow-[0_0_18px_rgba(56,189,248,0.6)]" />
            <div className="absolute w-[30px] h-[30px] rounded-full bg-white/40 blur-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
