"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Laugh, BookOpen, VenetianMask } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Mode = "Comedy" | "Story" | "Mystery";

const info: Record<
  Mode,
  { icon: LucideIcon; blurb: string; example: string }
> = {
  Comedy: {
    icon: Laugh,
    blurb:
      "Learn with humor: puns, playful analogies, and witty banter keep concepts sticky.",
    example:
      'Algebra in Comedy Mode: "X isn\'t ghosting you—it\'s just shy. Let\'s coax it out with inverse ops."',
  },
  Story: {
    icon: BookOpen,
    blurb:
      "Turn topics into narratives with characters, arcs, and aha-moments you won’t forget.",
    example:
      "Photosynthesis as a tale of Sun, Leaf, and Water on a quest to make sugar.",
  },
  Mystery: {
    icon: VenetianMask,
    blurb:
      "Decode clues, solve puzzles, and unveil answers like a detective of knowledge.",
    example:
      "History lesson as a case file: motive, evidence, suspects—then the reveal.",
  },
};

export default function Modes() {
  const [mode, setMode] = useState<Mode>("Comedy");
  const tabs: Mode[] = ["Comedy", "Story", "Mystery"];
  const CurrentIcon = info[mode].icon;

  return (
    <section id="modes" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Immersive <span className="text-fuchsia-300">Modes</span>
          </h2>
        </div>

        <div className="mx-auto mt-8 w-full max-w-3xl">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
            {tabs.map((m) => {
              const Icon = info[m].icon;
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={active}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
                    active
                      ? "bg-white text-neutral-900"
                      : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {m}
                </button>
              );
            })}
          </div>

          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6"
          >
            <div className="flex items-start gap-3">
              <CurrentIcon className="mt-1 h-5 w-5" />
              <div>
                <p className="text-sm text-white/80">{info[mode].blurb}</p>
                <p className="mt-3 text-sm text-white/60">
                  Example: {info[mode].example}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
