"use client";

import React, { useMemo, useState } from "react";
import { Wand2, FileText } from "lucide-react";
import { motion } from "framer-motion";

type Node = {
  id: string;
  label: string;
  x: number; // 0..100
  y: number; // 0..100
  blurb: string;
};

const NODES: Node[] = [
  { id: "center", label: "Aidanna", x: 50, y: 45, blurb: "Emotionally intelligent, adaptive teacher." },
  { id: "comedy", label: "Comedy", x: 20, y: 20, blurb: "Humor & witty analogies that make concepts stick." },
  { id: "story", label: "Story", x: 80, y: 22, blurb: "Narratives, characters & arcs for deep retention." },
  { id: "mystery", label: "Mystery", x: 18, y: 72, blurb: "Puzzles & clues so you learn by discovering." },
  { id: "maps", label: "Mindmaps", x: 50, y: 80, blurb: "Auto-generated concept maps connect the dots." },
  { id: "cards", label: "Flashcards", x: 82, y: 70, blurb: "Spaced repetition with smart distractors." },
  { id: "challenge", label: "Challenges", x: 50, y: 12, blurb: "Adaptive levels: Easy → Medium → Hard." },
];

const EDGES: Array<[string, string]> = [
  ["center", "comedy"],
  ["center", "story"],
  ["center", "mystery"],
  ["center", "maps"],
  ["center", "cards"],
  ["center", "challenge"],
];

const FLASHCARDS = [
  { q: "What is a gradient?", a: "A vector of partial derivatives; direction of steepest ascent." },
  { q: "State the Null Hypothesis", a: "A default claim that there is no effect or difference." },
  { q: "Define entropy", a: "A measure of uncertainty or disorder in a system." },
  { q: "What is a prime?", a: "An integer > 1 with no positive divisors other than 1 and itself." },
];

export default function MindmapFlashcards() {
  const [active, setActive] = useState<Node>(NODES[0]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { currQ, currA } = useMemo(
    () => ({ currQ: FLASHCARDS[index].q, currA: FLASHCARDS[index].a }),
    [index]
  );

  const next = () => {
    setIndex((i) => (i + 1) % FLASHCARDS.length);
    setFlipped(false);
  };
  const prev = () => {
    setIndex((i) => (i - 1 + FLASHCARDS.length) % FLASHCARDS.length);
    setFlipped(false);
  };

  return (
    <section className="py-16 sm:py-24 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {/* Mindmaps */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 p-2">
              <Wand2 className="h-5 w-5" />
              <span className="text-sm font-medium">Mindmaps</span>
            </div>
            <h3 className="text-xl font-semibold">See the big picture</h3>
            <p className="mt-2 text-sm text-white/70">
              Tap nodes to explore how concepts connect. This tiny preview mirrors Aidanna’s auto-maps.
            </p>

            {/* Map Canvas */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-3">
              <div className="relative h-[260px] w-full">
                {/* Edges */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {EDGES.map(([a, b], i) => {
                    const A = NODES.find((n) => n.id === a)!;
                    const B = NODES.find((n) => n.id === b)!;
                    return (
                      <motion.line
                        key={i}
                        x1={A.x}
                        y1={A.y}
                        x2={B.x}
                        y2={B.y}
                        stroke="url(#edge)"
                        strokeWidth="0.6"
                        initial={{ pathLength: 0, opacity: 0.4 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(244,114,182,0.8)" />
                      <stop offset="100%" stopColor="rgba(139,92,246,0.8)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Nodes */}
                {NODES.map((n) => {
                  const isActive = active.id === n.id;
                  return (
                    <button
                      key={n.id}
                      onClick={() => setActive(n)}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                      style={{ left: `${n.x}%`, top: `${n.y}%` }}
                      aria-pressed={isActive}
                    >
                      <motion.div
                        className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-full px-3 text-xs font-medium ${
                          isActive
                            ? "bg-white text-neutral-900"
                            : "border border-white/20 bg-white/5 text-white/80 backdrop-blur group-hover:bg-white/10"
                        }`}
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {n.label}
                      </motion.div>
                    </button>
                  );
                })}
              </div>

              {/* Active blurb */}
              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
                <span className="font-medium">{active.label}: </span>
                <span className="text-white/70">{active.blurb}</span>
              </div>
            </div>
          </div>

          {/* Flashcards */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-sky-500/20 to-teal-500/20 p-2">
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Flashcards</span>
            </div>
            <h3 className="text-xl font-semibold">Memorize with rhythm</h3>
            <p className="mt-2 text-sm text-white/70">
              Flip to reveal answers. Use next/prev to sample the spaced-repetition flow.
            </p>

            {/* Card */}
            <div className="mt-4">
              <div
                className="relative mx-auto h-40 w-full max-w-md [perspective:1000px]"
                aria-live="polite"
              >
                <button
                  onClick={() => setFlipped((f) => !f)}
                  className="group absolute inset-0 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition
                             [transform-style:preserve-3d]
                             data-[flip=true]:[transform:rotateY(180deg)]"
                  data-flip={flipped}
                  aria-expanded={flipped}
                >
                  {/* Front */}
                  <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
                    <p className="text-base text-white/90">{currQ}</p>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 flex rotate-y-180 items-center justify-center rounded-2xl bg-white/10 p-5 [backface-visibility:hidden]">
                    <p className="text-base text-white/90">{currA}</p>
                  </div>
                </button>
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={prev}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                >
                  Prev
                </button>
                <button
                  onClick={() => setFlipped((f) => !f)}
                  className="rounded-xl bg-white px-4 py-1.5 text-sm font-semibold text-neutral-900 hover:bg-white/90"
                >
                  {flipped ? "Show Question" : "Show Answer"}
                </button>
                <button
                  onClick={next}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                >
                  Next
                </button>
              </div>

              <p className="mt-2 text-center text-xs text-white/50">
                Card {index + 1} / {FLASHCARDS.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
