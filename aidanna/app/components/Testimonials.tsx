import React from "react";


export default function Testimonials() {
const quotes = [
{ name: "Aisha", role: "Medical student", quote: "I finished a week of cardiology in two evenings. Comedy Mode kept me going—who knew EKGs could be funny?" },
{ name: "Diego", role: "Data analyst", quote: "Mindmaps + Challenges = chef’s kiss. I actually *want* to revise now." },
{ name: "Lina", role: "Teacher", quote: "Story Mode turned dry history into bingeable episodes. My class is hooked." },
];


return (
<section className="py-16 sm:py-24">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="mx-auto max-w-3xl text-center">
<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Loved by learners</h2>
<p className="mt-3 text-white/70">Real voices. Real outcomes.</p>
</div>
<div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
{quotes.map((q) => (
<blockquote key={q.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
<p className="text-sm text-white/80">“{q.quote}”</p>
<footer className="mt-4 text-xs text-white/60">{q.name} · {q.role}</footer>
</blockquote>
))}
</div>
</div>
</section>
);
}