import React from "react";
export default function Trustbar() {
return (
<section className="py-10">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="grid items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-3">
{[
{ k: "Personalized", v: "Tailored lessons for you" },
{ k: "Adaptive", v: "Gets smarter every session" },
{ k: "Immersive", v: "Comedy · Story · Mystery" },
].map((item) => (
<div key={item.k} className="text-center">
<p className="text-xs uppercase tracking-wider text-white/50">{item.k}</p>
<p className="mt-1 text-sm text-white/80">{item.v}</p>
</div>
))}
</div>
</div>
</section>
);
}