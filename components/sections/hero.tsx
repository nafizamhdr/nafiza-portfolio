"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_SPLIT = 5;
const MAX_SPLIT = 95;
const DEFAULT_SPLIT = 50;

type RoleData = {
  eyebrow: string;
  title: string;
  subtitle: string[];
  ctaLabel: string;
  accentClass: string;
  textClass: string;
  subtitleClass: string;
  ctaClass: string;
  bgClass: string;
  navAccent: string;
};

const ROLES: { left: RoleData; right: RoleData } = {
  left: {
    eyebrow: "Web & Interfaces",
    title: "FULLSTACK DEV",
    subtitle: [
      "I build modern web applications with intuitive",
      "interfaces and clean architecture.",
    ],
    ctaLabel: "View Projects",
    accentClass: "text-green",
    textClass: "text-navy",
    subtitleClass: "text-navy/70",
    ctaClass: "pill-cta-green text-white",
    bgClass: "bg-cream",
    navAccent: "text-green",
  },
  right: {
    eyebrow: "AI & Machine Learning",
    title: "ML ENGINEER",
    subtitle: [
      "I architect intelligent systems that",
      "learn from data and power automation.",
    ],
    ctaLabel: "Explore Models",
    accentClass: "text-indigo-soft",
    textClass: "text-white",
    subtitleClass: "text-white/70",
    ctaClass: "pill-cta-indigo text-white",
    bgClass: "bg-background",
    navAccent: "text-indigo-soft",
  },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [leftDominant, setLeftDominant] = useState(true);
  const [hasInteraction, setHasInteraction] = useState(false);

  /* Refs for rAF-driven lerp — no React re-renders per frame */
  const targetSplit = useRef(DEFAULT_SPLIT);
  const currentSplit = useRef(DEFAULT_SPLIT);
  const rafId = useRef<number>(0);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let running = true;
    const LERP_FACTOR = 0.08; // ≈0.6s to settle (smooth exponential decay)

    function animate() {
      if (!running) return;

      const prev = currentSplit.current;
      currentSplit.current += (targetSplit.current - currentSplit.current) * LERP_FACTOR;

      // Update CSS variable directly on the DOM — no React re-render
      el!.style.setProperty("--split", `${currentSplit.current}%`);

      // Only trigger React re-render when crossing 50% boundary
      const wasLeft = prev >= 50;
      const isLeft = currentSplit.current >= 50;
      if (wasLeft !== isLeft) {
        setLeftDominant(isLeft);
      }

      rafId.current = requestAnimationFrame(animate);
    }

    rafId.current = requestAnimationFrame(animate);

    function setTargetFromClientX(clientX: number) {
      const rect = el!.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const inverted = 1 - Math.max(0, Math.min(1, x));
      targetSplit.current = MIN_SPLIT + inverted * (MAX_SPLIT - MIN_SPLIT);
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        setHasInteraction(true);
      }
    }

    function onMove(e: MouseEvent) {
      setTargetFromClientX(e.clientX);
    }
    function onTouch(e: TouchEvent) {
      if (e.touches[0]) setTargetFromClientX(e.touches[0].clientX);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onTouch, { passive: true });
    el.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      running = false;
      cancelAnimationFrame(rafId.current);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onTouch);
      el.removeEventListener("touchstart", onTouch);
    };
  }, []);

  const splitVar = `${DEFAULT_SPLIT}%`; // initial value only, rAF overrides via DOM

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden pt-16 select-none touch-none"
      style={{ ["--split" as string]: splitVar }}
      aria-label="Hero section — move mouse or drag to switch between Fullstack Dev and ML Engineer"
    >
      {/* LEFT half — fullstack (cream) */}
      <SideLayer
        role={ROLES.left}
        clipPath={`polygon(0 0, var(--split) 0, var(--split) 100%, 0 100%)`}
        active={leftDominant}
        position="left"
      />

      {/* RIGHT half — ML (navy) */}
      <SideLayer
        role={ROLES.right}
        clipPath={`polygon(var(--split) 0, 100% 0, 100% 100%, var(--split) 100%)`}
        active={!leftDominant}
        position="right"
      />

      {/* Center divider */}
      <div
        className="absolute top-16 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent pointer-events-none hero-side-transition"
        style={{ left: `var(--split)`, transform: "translateX(-50%)" }}
      />

      {/* Bottom hint */}
      <div
        className={cn(
          "absolute bottom-5 inset-x-0 flex items-center justify-center gap-2 text-[10px] tracking-[0.24em] font-medium uppercase pointer-events-none transition-colors duration-500 z-20",
          leftDominant ? "text-navy/50" : "text-white/40"
        )}
      >
        <span className="h-px w-6 sm:w-8 bg-current opacity-50" />
        <span className="hidden sm:inline">Move your mouse</span>
        <span className="sm:hidden">Drag to switch</span>
        <span className="h-px w-6 sm:w-8 bg-current opacity-50" />
      </div>

      {/* Initial nudge animation for first-time users */}
      {!hasInteraction && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full bg-white/15 overflow-hidden z-20 pointer-events-none">
          <div className="h-full w-1/3 bg-white/60 rounded-full anim-nudge" />
        </div>
      )}
    </section>
  );
}

function SideLayer({
  role,
  clipPath,
  active,
  position,
}: {
  role: RoleData;
  clipPath: string;
  active: boolean;
  position: "left" | "right";
}) {
  return (
    <div
      className="absolute inset-0 hero-side-transition"
      style={{ clipPath }}
    >
      <div className={cn("absolute inset-0", role.bgClass)} />

      {/* Decorations — kept inside each half, only on md+ */}
      {position === "left" ? <CreamDecorations /> : <NavyDecorations />}

      {/* Centered content — same position in both layers so they overlap perfectly */}
      <div className="absolute inset-0 pt-16 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
          <div
            className={cn(
              "inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-5 sm:mb-6 transition-opacity duration-300",
              role.accentClass,
              !active && "opacity-90"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {role.eyebrow}
          </div>

          <h1
            className={cn(
              "font-display font-black uppercase tracking-[-0.02em] leading-[0.95] whitespace-nowrap",
              "text-[clamp(2rem,8vw,5.5rem)]",
              role.textClass
            )}
          >
            {role.title}
          </h1>

          <p
            className={cn(
              "mt-5 sm:mt-6 text-sm sm:text-base md:text-lg max-w-md sm:max-w-xl text-balance leading-relaxed px-2",
              role.subtitleClass
            )}
          >
            {role.subtitle.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>

          <a
            href="#projects"
            className={cn(
              "mt-7 sm:mt-8 inline-flex items-center gap-2 h-10 sm:h-11 px-6 sm:px-7 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase cursor-pointer transition-transform hover:scale-[1.03] pointer-events-auto",
              role.ctaClass
            )}
            aria-label={role.ctaLabel}
            tabIndex={active ? 0 : -1}
          >
            {role.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* === Cream side decorations (Full Stack) === */
function CreamDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      {/* Top-left: code card */}
      <div className="absolute left-[6%] top-[18%] anim-float-y">
        <div className="px-5 py-4 rounded-2xl border border-navy/10 bg-white/40 backdrop-blur-sm shadow-sm font-mono text-navy/60">
          <div className="text-xs">
            <span className="text-green">const</span> portfolio = {"{"}
          </div>
          <div className="text-xs pl-3">
            role: <span className="text-green">{"'frontend'"}</span>,
          </div>
          <div className="text-xs">{"}"}</div>
        </div>
      </div>

      {/* Mid-left: orbit */}
      <div className="absolute left-[10%] top-[58%] anim-float-x">
        <div className="relative h-20 w-20 grid place-items-center">
          <div className="absolute inset-0 anim-spin-slow">
            <div className="absolute inset-0 rounded-full border border-green/40" />
            <div className="absolute inset-0 rounded-full border border-green/40" style={{ transform: "rotate(60deg)" }} />
            <div className="absolute inset-0 rounded-full border border-green/40" style={{ transform: "rotate(120deg)" }} />
          </div>
          <div className="h-3 w-3 rounded-full bg-green anim-pulse-soft" />
        </div>
      </div>

      {/* Bottom-left: grid */}
      <div className="absolute left-[8%] bottom-[16%] anim-drift">
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-2.5 w-2.5 rounded-sm bg-navy/15"
              style={{ animation: `pulse-soft 2s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
      </div>

      {/* Top-center small badge */}
      <div className="absolute left-[22%] top-[12%] anim-float-y" style={{ animationDelay: "1s" }}>
        <div className="px-3 py-1.5 rounded-full border border-navy/10 bg-white/40 backdrop-blur-sm text-[10px] font-mono text-navy/50 tracking-wider">
          &lt;component /&gt;
        </div>
      </div>
    </div>
  );
}

/* === Navy side decorations (ML Engineer) === */
function NavyDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      <div className="absolute right-[6%] top-[14%] anim-float-y">
        <NeuralNet />
      </div>

      <div className="absolute right-[8%] top-[55%] anim-float-x" style={{ animationDelay: "0.7s" }}>
        <div className="px-5 py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm font-mono text-white/60 text-xs space-y-1">
          <div><span className="text-indigo-soft">import</span> torch</div>
          <div><span className="text-indigo-soft">model</span>.fit(X_train)</div>
          <div><span className="text-indigo-soft">predict</span>(X_test)</div>
        </div>
      </div>

      <div className="absolute right-[10%] bottom-[16%]">
        <ScatteredDots />
      </div>

      <div className="absolute right-[28%] top-[18%] anim-math-float text-white/20 font-display text-4xl">∑</div>
      <div className="absolute right-[22%] bottom-[30%] anim-math-float text-white/15 font-display text-3xl" style={{ animationDelay: "2s" }}>∇</div>
    </div>
  );
}

function NeuralNet() {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" className="opacity-80">
      <g stroke="#6366F1" strokeWidth="0.6" opacity="0.5">
        <line x1="20" y1="20" x2="70" y2="30" className="anim-flicker" />
        <line x1="20" y1="20" x2="70" y2="55" className="anim-flicker" style={{ animationDelay: "0.3s" }} />
        <line x1="20" y1="55" x2="70" y2="30" className="anim-flicker" style={{ animationDelay: "0.6s" }} />
        <line x1="20" y1="55" x2="70" y2="55" className="anim-flicker" style={{ animationDelay: "0.9s" }} />
        <line x1="20" y1="80" x2="70" y2="55" className="anim-flicker" style={{ animationDelay: "1.2s" }} />
        <line x1="20" y1="80" x2="70" y2="80" className="anim-flicker" style={{ animationDelay: "0.4s" }} />
        <line x1="70" y1="30" x2="120" y2="50" className="anim-flicker" style={{ animationDelay: "0.2s" }} />
        <line x1="70" y1="55" x2="120" y2="50" className="anim-flicker" style={{ animationDelay: "0.7s" }} />
        <line x1="70" y1="80" x2="120" y2="50" className="anim-flicker" style={{ animationDelay: "1.1s" }} />
      </g>
      <g fill="#6366F1">
        <circle cx="20" cy="20" r="3.5" className="anim-pulse-soft" />
        <circle cx="20" cy="55" r="3.5" className="anim-pulse-soft" style={{ animationDelay: "0.4s" }} />
        <circle cx="20" cy="80" r="3.5" className="anim-pulse-soft" style={{ animationDelay: "0.8s" }} />
        <circle cx="70" cy="30" r="4" className="anim-pulse-soft" style={{ animationDelay: "0.2s" }} />
        <circle cx="70" cy="55" r="4" className="anim-pulse-soft" style={{ animationDelay: "0.6s" }} />
        <circle cx="70" cy="80" r="4" className="anim-pulse-soft" style={{ animationDelay: "1s" }} />
        <rect x="116" y="46" width="8" height="8" rx="1.5" className="anim-pulse-soft" style={{ animationDelay: "0.5s" }} />
      </g>
    </svg>
  );
}

function ScatteredDots() {
  const dots = [
    { x: 0, y: 30, delay: 0 },
    { x: 30, y: 0, delay: 0.5 },
    { x: 60, y: 25, delay: 1 },
    { x: 20, y: 55, delay: 1.5 },
    { x: 70, y: 60, delay: 2 },
    { x: 45, y: 80, delay: 2.5 },
  ];
  return (
    <svg width="90" height="100" viewBox="0 0 90 100" fill="none">
      <g fill="#6366F1">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x + 10} cy={d.y + 10} r="3" className="anim-drift" style={{ animationDelay: `${d.delay}s` }} />
        ))}
        <line x1="40" y1="10" x2="10" y2="40" stroke="#6366F1" strokeWidth="0.5" opacity="0.4" className="anim-flicker" />
        <line x1="70" y1="35" x2="40" y2="10" stroke="#6366F1" strokeWidth="0.5" opacity="0.4" className="anim-flicker" style={{ animationDelay: "0.8s" }} />
      </g>
    </svg>
  );
}
