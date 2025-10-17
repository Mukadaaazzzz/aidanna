import React from "react";
import { Compass, Star } from "lucide-react";

export default function Challenge() {
  const levels = [
    { label: "Easy", stars: 1 },
    { label: "Medium", stars: 3 },
    { label: "Hard", stars: 5 },
  ] as const;

  return (
    <section
      id="challenge"
      className="py-16 sm:py-24 overflow-x-hidden" // clip any tiny overflow
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0"> {/* allow contents to shrink */}
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Challenge <span className="text-fuchsia-300">Aidanna</span>
            </h3>
            <p className="mt-2 text-white/70">
              Enter the arena. Aidanna quizzes you with adaptive difficulty and
              playful feedback.
            </p>

            <div className="mt-6 flex gap-3 min-w-0">
              {levels.map(({ label, stars }) => (
                <div
                  key={label}
                  className="flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="truncate text-sm font-medium">{label}</span>
                  <span
                    aria-hidden
                    className="ml-2 flex shrink-0 items-center gap-1 text-amber-300"
                  >
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6">
              <div className="flex items-start gap-3">
                <Compass className="mt-1 h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-white/80">
                    Answer quick-fire questions, unlock streaks, and climb the
                    mastery ladder.
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    Adaptive timers & hints keep it fun and focused.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/70">
                {[
                  "Definition Duel",
                  "Equation Sprint",
                  "Concept Connect",
                  "Explain Like I’m 5",
                ].map((t) => (
                  <div
                    key={t}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
