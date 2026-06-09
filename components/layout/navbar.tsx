"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#home", label: "HOME" },
  { href: "#profil", label: "PROFIL" },
  { href: "#skills", label: "SKILLS" },
  { href: "#projects", label: "PROJECTS" },
  { href: "#contact", label: "CONTACT" },
];

export function Navbar() {
  const [active, setActive] = useState("#home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/5">
      <nav className="w-full px-16 flex items-center justify-between h-16">
        <Link
          href="#home"
          className="flex items-center gap-2 group cursor-pointer"
          aria-label="Home"
        >
          <span className="h-2 w-2 rounded-full bg-white" />
          <span className="text-xs sm:text-sm font-semibold tracking-[0.18em] text-white">
            NAFIZA MAHADRI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-1.5 text-[11px] font-semibold tracking-[0.16em] rounded-full transition-all duration-300 cursor-pointer",
                  isActive
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden grid h-9 w-9 place-items-center rounded-md text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-black/95">
          <div className="w-full px-16 py-3 flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-3 text-[11px] font-semibold tracking-[0.16em] rounded-md transition-colors cursor-pointer",
                  active === link.href
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
