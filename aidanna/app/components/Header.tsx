"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import logoPng from "@/public/logo.png"; // <— static import for stable SSR/CSR

export default function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    { href: "#modes", label: "Modes" },
    { href: "#features", label: "Features" },
    { href: "#challenge", label: "Challenge" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#" className="flex items-center gap-3">
          {/* Avoid odd, non-tailwind sizes like h-15; rely on width/height */}
          <Image
            src={logoPng}
            alt="Aidanna"
            width={36}
            height={36}
            priority
            className="rounded"
          />
          <span className="font-semibold tracking-tight">Aidanna</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-white/70 transition hover:text-white">
              {n.label}
            </a>
          ))}
          <Link
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-200 shadow-sm transition hover:bg-fuchsia-500/20"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>

        <button aria-label="Open menu" className="md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6 lg:px-8">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/5">
                {n.label}
              </a>
            ))}
            <Link
              href="#pricing"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-fuchsia-600 px-4 py-2 font-medium text-white hover:bg-fuchsia-500"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
