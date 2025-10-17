import React from "react";
import { Upload, CheckCircle2 } from "lucide-react";


export default function ImmersionUpload() {
return (
<section className="py-16 sm:py-24">
<div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
<div className="order-2 lg:order-1">
<div className="mx-auto max-w-xl rounded-3xl border border-dashed border-fuchsia-500/40 bg-white/5 p-6">
<div className="flex items-center gap-3 text-fuchsia-200">
<Upload className="h-5 w-5" />
<span className="text-sm font-medium">Upload PDFs, slides, or notes</span>
</div>
<p className="mt-2 text-sm text-white/70">Aidanna transforms your files into immersive lessons in Comedy, Story, or Mystery mode—your call.</p>
<div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/60 sm:grid-cols-3">
{["Course PDFs","Research Papers","Lecture Slides","Notes","Docs","Links"].map((t)=> (
<div key={t} className="rounded-lg border border-white/10 bg-white/5 p-3">{t}</div>
))}
</div>
</div>
</div>
<div className="order-1 space-y-4 lg:order-2">
<h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Learn from <span className="text-fuchsia-300">your</span> materials</h3>
<p className="text-white/70">Drop in any content and watch Aidanna reframe it in the tone you choose—jokes, narratives, or detective vibes.</p>
<ul className="space-y-2 text-sm text-white/80">
{[
"Automatic outlining & examples",
"Quizzes woven into the lesson",
"Progress-aware summaries",
].map((t)=> (
<li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-fuchsia-300" /> {t}</li>
))}
</ul>
</div>
</div>
</section>
);
}