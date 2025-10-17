import React from "react";


export default function FAQ() {
const faqs = [
{ q: "What makes Aidanna \"emotionally intelligent\"?", a: "It tunes into your pace, sentiment, and engagement signals to adjust explanations, prompts, and practice." },
{ q: "Can I upload my own materials?", a: "Yes—PDFs, docs, slides, and links. Aidanna builds lessons, mindmaps, and flashcards from them." },
{ q: "How do the modes work?", a: "Pick Comedy, Story, or Mystery. The teaching style, examples, and activities adapt to match your choice." },
{ q: "Is my data private?", a: "Your content stays your own. We use strict privacy and security practices to protect it." },
];


return (
<section id="faq" className="py-16 sm:py-24">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="mx-auto max-w-3xl text-center">
<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Questions, answered</h2>
<p className="mt-3 text-white/70">If you’re wondering, you’re not alone.</p>
</div>
<div className="mx-auto mt-10 max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
{faqs.map((f) => (
<details key={f.q} className="group p-5 open:bg-white/0">
<summary className="flex cursor-pointer list-none items-center justify-between text-left text-sm font-medium text-white/90">
{f.q}
<span className="ml-4 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60 group-open:rotate-180">▼</span>
</summary>
<p className="mt-2 text-sm text-white/70">{f.a}</p>
</details>
))}
</div>
</div>
</section>
);
}