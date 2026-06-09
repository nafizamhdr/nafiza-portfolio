"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function About() {
  return (
    <section id="profil" className="relative py-24 md:py-32 scroll-mt-16 overflow-hidden">
      <BackgroundGlow />

      <div className="container-tight relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT — Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase mb-6">
              <span className="h-px w-10 bg-gradient-to-r from-green to-indigo" />
              <span className="gradient-text-green-indigo">AI Engineer & Fullstack Dev</span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              <span className="text-white">Nafiza Mahadri </span>
              <span className="text-white/30">Widyatamaka</span>
            </h2>

            <p className="mt-6 text-base md:text-lg text-white/65 leading-relaxed max-w-xl">
              {siteConfig.bio}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="pill-cta-indigo text-white inline-flex items-center gap-2 h-11 px-7 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase cursor-pointer transition-transform hover:scale-[1.03]"
              >
                Start a Discussion
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-white/15 text-[11px] font-bold tracking-[0.18em] uppercase text-white/80 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
              >
                View GitHub
              </a>
            </div>

            {/* Education + Experience compact */}
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {siteConfig.education.map((e, i) => (
                <InfoCard
                  key={`edu-${i}`}
                  label="Education"
                  title={e.school}
                  meta={`${e.degree} · ${e.period}`}
                />
              ))}
              {siteConfig.experience.map((e, i) => (
                <InfoCard
                  key={`exp-${i}`}
                  label="Experience"
                  title={e.role}
                  meta={`${e.company} · ${e.period}`}
                />
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-green/20 via-transparent to-indigo/20 blur-2xl anim-pulse-soft" />
              <div className="relative h-[360px] w-[280px] sm:h-[440px] sm:w-[340px] rounded-[2rem] overflow-hidden border border-white/10 bg-card">
                <Image
                  src={siteConfig.avatar}
                  alt={siteConfig.name}
                  fill
                  sizes="(min-width: 768px) 340px, 280px"
                  className="object-cover"
                  priority
                />
                {/* Top-left tiny badge */}
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-[9px] font-bold tracking-[0.2em] uppercase text-white/80 border border-white/10">
                  Yogyakarta · ID
                </div>
              </div>
              {/* Floating dot accents */}
              <div className="absolute -top-3 -right-3 h-3 w-3 rounded-full bg-green anim-pulse-soft" />
              <div className="absolute -bottom-3 -left-3 h-3 w-3 rounded-full bg-indigo anim-pulse-soft" style={{ animationDelay: "1s" }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, title, meta }: { label: string; title: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-indigo-soft">
        {label}
      </div>
      <div className="mt-2 font-semibold text-white text-sm">{title}</div>
      <div className="text-xs text-white/50 mt-0.5">{meta}</div>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-indigo/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full bg-green/5 blur-[100px] pointer-events-none" />
    </>
  );
}
