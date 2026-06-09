"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Smartphone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_SPLIT = 5;
const MAX_SPLIT = 95;
const DEFAULT_SPLIT = 50;
const GYRO_MAX_TILT = 25;
const GYRO_DEADZONE = 3;
const AUTO_ROTATE_INTERVAL_MS = 4000;

type Mode =
  | "unknown"
  | "desktop" // mouse-controlled
  | "gyro-pending" // iOS, awaiting permission
  | "gyro-active" // gyro listener attached
  | "auto-rotate" // no gyro / permission denied — auto cycle
  | "static"; // ultimate fallback

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
  },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [split, setSplit] = useState(DEFAULT_SPLIT);
  const [mode, setMode] = useState<Mode>("unknown");
  const splitRef = useRef(split);
  splitRef.current = split;

  // ---- Mode detection on mount ----
  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (!coarse) {
      setMode("desktop");
      return;
    }

    const orientationAvailable = typeof window.DeviceOrientationEvent !== "undefined";
    if (!orientationAvailable) {
      setMode("auto-rotate");
      return;
    }

    // iOS 13+ requires explicit permission via user gesture
    // @ts-expect-error — non-standard iOS API
    const needsPermission = typeof DeviceOrientationEvent.requestPermission === "function";
    setMode(needsPermission ? "gyro-pending" : "gyro-active");
  }, []);

  // ---- Mouse (desktop) ----
  useEffect(() => {
    if (mode !== "desktop") return;
    const el = ref.current;
    if (!el) return;

    function setSplitFromClientX(clientX: number) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      // Inverted: mouse right -> cream side bigger (split smaller)
      const inverted = 1 - Math.max(0, Math.min(1, x));
      setSplit(MIN_SPLIT + inverted * (MAX_SPLIT - MIN_SPLIT));
    }
    function onMove(e: MouseEvent) {
      setSplitFromClientX(e.clientX);
    }
    function onLeave() {
      setSplit(DEFAULT_SPLIT);
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [mode]);

  // ---- Gyroscope (mobile, granted) ----
  useEffect(() => {
    if (mode !== "gyro-active") return;

    function onOrientation(e: DeviceOrientationEvent) {
      const gamma = e.gamma; // left-right tilt, -90..90
      if (gamma == null) return;

      let norm: number;
      if (Math.abs(gamma) < GYRO_DEADZONE) {
        norm = 0.5;
      } else {
        const sign = Math.sign(gamma);
        const abs = Math.min(Math.abs(gamma), GYRO_MAX_TILT);
        const t = (abs - GYRO_DEADZONE) / (GYRO_MAX_TILT - GYRO_DEADZONE);
        norm = 0.5 + sign * t * 0.5; // 0..1
      }
      // Inverted to match mouse: tilt right -> cream side grows
      const inverted = 1 - norm;
      setSplit(MIN_SPLIT + inverted * (MAX_SPLIT - MIN_SPLIT));
    }

    window.addEventListener("deviceorientation", onOrientation);
    return () => window.removeEventListener("deviceorientation", onOrientation);
  }, [mode]);

  // ---- Auto-rotate fallback ----
  useEffect(() => {
    if (mode !== "auto-rotate") return;

    const targets = [30, 70];
    let i = 0;
    let raf = 0;
    let target = targets[i];

    const interval = window.setInterval(() => {
      i = (i + 1) % targets.length;
      target = targets[i];
    }, AUTO_ROTATE_INTERVAL_MS);

    function tick() {
      setSplit((prev) => {
        const next = prev + (target - prev) * 0.06;
        return Math.abs(next - target) < 0.05 ? target : next;
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(raf);
    };
  }, [mode]);

  // ---- iOS permission request ----
  const requestGyroPermission = useCallback(async () => {
    try {
      // @ts-expect-error — non-standard iOS API
      const res = await DeviceOrientationEvent.requestPermission();
      if (res === "granted") {
        setMode("gyro-active");
      } else {
        setMode("auto-rotate");
      }
    } catch {
      setMode("auto-rotate");
    }
  }, []);

  const leftDominant = split >= 50;

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden select-none"
      style={{ ["--split" as string]: `${split}%` }}
      aria-label="Hero — interactive split between Fullstack Dev and ML Engineer"
    >
      <SideLayer
        role={ROLES.left}
        clipPath={`polygon(0 0, var(--split) 0, var(--split) 100%, 0 100%)`}
        position="left"
      />
      <SideLayer
        role={ROLES.right}
        clipPath={`polygon(var(--split) 0, 100% 0, 100% 100%, var(--split) 100%)`}
        position="right"
      />

      {/* Center divider */}
      <div
        className="absolute top-16 bottom-24 sm:bottom-20 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent pointer-events-none"
        style={{ left: `var(--split)`, transform: "translateX(-50%)" }}
      />

      {/* Bottom hint + iOS permission button */}
      <div
        className={cn(
          "absolute bottom-5 inset-x-0 flex items-center justify-center gap-2 text-[10px] tracking-[0.24em] font-medium uppercase transition-colors duration-500 z-20",
          leftDominant ? "text-navy/50" : "text-white/40"
        )}
      >
        {mode === "gyro-pending" ? (
          <button
            type="button"
            onClick={requestGyroPermission}
            className={cn(
              "pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm cursor-pointer transition-colors",
              leftDominant
                ? "border-navy/20 bg-white/30 text-navy/80 hover:bg-white/50"
                : "border-white/15 bg-white/[0.04] text-white/80 hover:bg-white/10"
            )}
            aria-label="Enable device tilt control"
          >
            <Smartphone className="h-3.5 w-3.5" />
            Tap to enable tilt
          </button>
        ) : (
          <div className="pointer-events-none flex items-center gap-2">
            <span className="h-px w-6 sm:w-8 bg-current opacity-50" />
            <span>
              {mode === "desktop" && "Move your mouse"}
              {mode === "gyro-active" && "Tilt your phone"}
              {mode === "auto-rotate" && "Auto-switching"}
              {mode === "static" && "—"}
              {mode === "unknown" && ""}
            </span>
            <span className="h-px w-6 sm:w-8 bg-current opacity-50" />
          </div>
        )}
      </div>
    </section>
  );
}

function SideLayer({
  role,
  clipPath,
  position,
}: {
  role: RoleData;
  clipPath: string;
  position: "left" | "right";
}) {
  return (
    <div className="absolute inset-0 hero-side-transition" style={{ clipPath }}>
      <div className={cn("absolute inset-0", role.bgClass)} />

      {position === "left" ? <CreamDecorations /> : <NavyDecorations />}

      {/* Centered content — pt-16 navbar offset, pb-24 hint area => true visual center */}
      <div className="absolute inset-0 pt-16 pb-24 sm:pb-20 flex items-center justify-center px-5 sm:px-6">
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
          <div
            className={cn(
              "inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.22em] uppercase mb-4 sm:mb-6",
              role.accentClass
            )}
          >
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {role.eyebrow}
          </div>

          <h1
            className={cn(
              "font-display font-black uppercase tracking-[-0.02em] leading-[0.95] whitespace-nowrap",
              "text-[clamp(1.875rem,9vw,5.5rem)]",
              role.textClass
            )}
          >
            {role.title}
          </h1>

          <p
            className={cn(
              "mt-4 sm:mt-6 text-[13px] sm:text-base md:text-lg max-w-md sm:max-w-xl text-balance leading-relaxed",
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
              "mt-6 sm:mt-8 inline-flex items-center gap-2 h-10 sm:h-11 px-6 sm:px-7 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase cursor-pointer transition-transform hover:scale-[1.03]",
              role.ctaClass
            )}
            aria-label={role.ctaLabel}
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
