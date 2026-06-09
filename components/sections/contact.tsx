"use client";

import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const socials = [
  {
    icon: Instagram,
    label: "Instagram",
    handle: "@nafizamhdri",
    href: siteConfig.socials.instagram,
    color: "#E1306C",
  },
  {
    icon: Github,
    label: "GitHub",
    handle: "Nafizamhdr",
    href: siteConfig.socials.github,
    color: "#FFFFFF",
  },
  {
    icon: Mail,
    label: "Email",
    handle: siteConfig.email,
    href: siteConfig.socials.email,
    color: "#00B86B",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "Nafiza Mahadri",
    href: siteConfig.socials.linkedin,
    color: "#6366F1",
  },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32 scroll-mt-16 overflow-hidden">
      <BackgroundGlow />

      <div className="container-tight relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
          className="text-center"
        >
          <div className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-4 gradient-text-green-indigo">
            Get in Touch
          </div>
          <h2 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95]">
            <span className="text-white">Let&apos;s</span>{" "}
            <span className="text-white/40">Connect</span>
            <span className="text-indigo">.</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-white/65 leading-relaxed">
            Open to collaborations on AI products, full-stack engineering, and Web3 projects. Drop a message — I usually reply within a day.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 hover:border-white/30 transition-all duration-300 cursor-pointer aspect-square flex flex-col items-center justify-center text-center"
            >
              {/* Color glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${s.color}15, transparent 70%)`,
                }}
              />
              <div
                className="grid place-items-center h-14 w-14 rounded-2xl border border-white/10 bg-white/[0.04] mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ color: s.color }}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/60 group-hover:text-white transition-colors">
                {s.label}
              </div>
              <div className="mt-1 text-xs text-white/40 group-hover:text-white/70 transition-colors truncate max-w-full">
                {s.handle}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BackgroundGlow() {
  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[800px] h-[400px] rounded-full bg-indigo/8 blur-[140px] pointer-events-none" />
  );
}
