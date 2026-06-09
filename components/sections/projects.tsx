"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  AI: "AI / Machine Learning",
  Fullstack: "Full Stack Development",
  Frontend: "Frontend / Web3",
  Backend: "Backend Engineering",
  Web3: "Web3 / Blockchain",
  Mobile: "Mobile Apps",
};

export function Projects({ projects }: { projects: Project[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, Project[]>();
    projects.forEach((p) => {
      const key = p.category;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries());
  }, [projects]);

  return (
    <section id="projects" className="relative py-24 md:py-32 scroll-mt-16 overflow-hidden">
      <BackgroundGlow />

      <div className="container-tight relative">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-4 gradient-text-green-indigo">
            Selected Work
          </div>
          <h2 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95]">
            <span className="text-white">Project</span>
            <br />
            <span className="text-white/40">Portfolio</span>
            <span className="text-indigo">.</span>
          </h2>
        </motion.div>

        {/* Grouped projects */}
        <div className="mt-20 space-y-20">
          {grouped.map(([category, items]) => (
            <CategoryGroup key={category} category={category} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryGroup({ category, items }: { category: string; items: Project[] }) {
  const label = categoryLabels[category] ?? category;
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
        <span className="text-[11px] font-bold tracking-[0.24em] uppercase text-white/60">
          {label}
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((p, i) => (
          <ProjectCard key={p.id} project={p} idx={i} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, idx }: { project: Project; idx: number }) {
  // Card-level link: prefer live deploy, fall back to repo if no demo
  const cardHref = project.demoUrl || project.repoUrl || undefined;
  const cardLabel = project.demoUrl
    ? `Open ${project.name} live demo`
    : project.repoUrl
    ? `View ${project.name} source on GitHub`
    : project.name;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: idx * 0.08 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] hover:border-indigo/40 transition-all duration-300",
        cardHref && "cursor-pointer"
      )}
    >
      {/* Full-card click overlay — sits below interactive children */}
      {cardHref && (
        <a
          href={cardHref}
          target="_blank"
          rel="noreferrer"
          aria-label={cardLabel}
          className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo rounded-3xl"
        />
      )}

      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center font-display font-black text-7xl text-white/10">
            {project.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold text-white group-hover:gradient-text-green-indigo transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-white/50 mt-1">{project.role}</p>
          </div>
          <div className="grid place-items-center h-9 w-9 rounded-full bg-white/5 border border-white/10 text-white/60 group-hover:bg-indigo group-hover:text-white group-hover:border-indigo transition-all">
            <ArrowUpRight className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          </div>
        </div>

        <p className="mt-4 text-sm text-white/65 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((s) => (
            <span
              key={s}
              className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/70 border border-white/10"
            >
              {s}
            </span>
          ))}
          {project.stack.length > 5 && (
            <span className="text-[10px] font-medium px-2.5 py-1 text-white/40">
              +{project.stack.length - 5}
            </span>
          )}
        </div>

        <div className="mt-5 pt-5 border-t border-white/5 flex items-center gap-4 text-xs">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-20 inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <Github className="h-3.5 w-3.5" />
              Source
            </a>
          )}
          {project.demoUrl && (
            <span className="relative z-20 ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase text-indigo-soft pointer-events-none">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-soft anim-pulse-soft" />
              Live
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function BackgroundGlow() {
  return (
    <>
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-indigo/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-green/5 blur-[120px] pointer-events-none" />
    </>
  );
}
