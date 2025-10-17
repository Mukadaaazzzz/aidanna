import React from "react";

export default function ShowcaseCard() {
  return (
    <div className="relative mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 shadow-2xl ring-1 ring-white/10">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/80 to-violet-500/80 shadow">
          <span className="text-lg font-bold">AI</span>
        </div>
        <div className="text-sm">
          <p className="font-medium">Emotional Intelligence</p>
          <p className="text-white/60">Understands tone, stress & interest</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          "Comedy Mode",
          "Story Mode",
          "Mystery Mode",
          "Mindmaps",
          "Flashcards",
          "Challenges",
        ].map((label) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
