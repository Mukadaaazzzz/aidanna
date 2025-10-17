import React from "react";
import { Brain, Sparkles, Wand2, FileText, Compass, Crown } from "lucide-react";


export default function Features() {
const features = [
{ icon: Brain, title: "Emotionally Intelligent Companion", desc: "Understands your tone, motivation, and attention to adapt feedback in real time." },
{ icon: Sparkles, title: "Multisensory Learning", desc: "Text, audio cues, visuals and interactions weave concepts into memory." },
{ icon: Wand2, title: "Mindmaps & Flashcards", desc: "Generate mindmaps and spaced-repetition flashcards from any topic or file." },
{ icon: FileText, title: "Bring Your PDFs & Docs", desc: "Drop in readings, syllabi, or notes—Aidanna digests and teaches in your chosen mode." },
{ icon: Compass, title: "Adaptive Challenges", desc: "Level up from Easy → Medium → Hard in a playful, game-like arena." },
{ icon: Crown, title: "Personal Mastery", desc: "Tracks progress and celebrates milestones with insights you can act on." },
];


return (
<section id="features" className="py-16 sm:py-24">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="mx-auto max-w-3xl text-center">
<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Features that feel <span className="text-fuchsia-300">magical</span></h2>
<p className="mt-3 text-white/70">Everything you need to learn faster—with delight.</p>
</div>
<div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
{features.map(({ icon: Icon, title, desc }) => (
<div key={title} className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm transition hover:bg-white/10 hover:shadow-lg">
<div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 p-2">
<Icon className="h-5 w-5" />
</div>
<h3 className="text-lg font-medium">{title}</h3>
<p className="mt-2 text-sm text-white/70">{desc}</p>
</div>
))}
</div>
</div>
</section>
);
}