"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, BadgeCheck, Sparkles } from "lucide-react";
import ShowcaseCard from "../components/ShowcaseCard";



export default function Hero() {
return (
<section className="relative isolate overflow-hidden">
<BackgroundGlow />
<div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
<Sparkles className="h-4 w-4" />
The first emotionally intelligent, invisible teacher
</div>
<h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
Meet <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">Aidanna</span>
</h1>
<p className="max-w-xl text-base text-white/70 sm:text-lg">
Aidanna understands you—mood, pace, style—and shapes lessons that fit like a glove. It learns from every interaction, just like a real human teacher, so you learn faster, deeper, and with joy.
</p>
<div className="flex flex-wrap gap-3">
<Link href="#pricing" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg hover:bg-white/90">
Start Learning
</Link>
<Link href="#features" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
Explore Features
</Link>
</div>
<div className="mt-6 flex flex-wrap gap-6 text-xs text-white/50">
<span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Private by design</span>
<span className="inline-flex items-center gap-2"><Zap className="h-4 w-4" /> Multisensory learning</span>
<span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> Learns & adapts to you</span>
</div>
</motion.div>
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
<ShowcaseCard />
</motion.div>
</div>
</section>
);
}


function BackgroundGlow() {
return (
<div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
<div className="absolute left-1/2 top-[-10%] aspect-square w-[80vw] -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-3xl" />
<div className="absolute right-[-10%] bottom-[-20%] aspect-square w-[50vw] rounded-full bg-sky-500/10 blur-3xl" />
</div>
);
}


