import React from "react";
import Link from "next/link";
import { ArrowRight, Crown, CheckCircle2 } from "lucide-react";


export default function Pricing() {
const tiers = [
{ name: "Starter", price: "$0", tagline: "Try Aidanna", cta: "Get Started", popular: false, features: ["5 uploads / month","Comedy & Story modes","Mindmaps & Flashcards"] },
{ name: "Pro", price: "$14/mo", tagline: "Level up your learning", cta: "Go Pro", popular: true, features: ["Unlimited uploads","All modes + Mystery","Adaptive Challenges","Progress insights","Priority access"] },
{ name: "Team", price: "$29/mo", tagline: "For classrooms & groups", cta: "Contact Sales", popular: false, features: ["Seats & roles","Shared sets & maps","Classroom dashboards","SSO & priority support"] },
];


return (
<section id="pricing" className="py-16 sm:py-24">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="mx-auto max-w-3xl text-center">
<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple, transparent <span className="text-fuchsia-300">pricing</span></h2>
<p className="mt-3 text-white/70">Start free. Upgrade when you’re ready.</p>
</div>
<div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
{tiers.map((t) => (
<div key={t.name} className={`relative rounded-3xl border bg-white/5 p-6 ${t.popular ? "border-fuchsia-400/40 ring-2 ring-fuchsia-400/40" : "border-white/10"}`}>
{t.popular && (
<div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-fuchsia-500 px-3 py-1 text-xs font-semibold text-white">Most Popular</div>
)}
<div className="flex items-baseline justify-between">
<h3 className="text-lg font-semibold">{t.name}</h3>
{t.popular ? <Crown className="h-5 w-5 text-fuchsia-300" /> : null}
</div>
<p className="mt-1 text-sm text-white/70">{t.tagline}</p>
<p className="mt-4 text-3xl font-semibold">{t.price}</p>
<ul className="mt-4 space-y-2 text-sm text-white/80">
{t.features.map((f) => (
<li key={f} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-fuchsia-300" /> {f}</li>
))}
</ul>
<Link href="#" className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium ${t.popular ? "bg-white text-neutral-900 hover:bg-white/90" : "border border-white/15 bg-white/5 text-white hover:bg-white/10"}`}>
{t.cta} <ArrowRight className="h-4 w-4" />
</Link>
</div>
))}
</div>
<p className="mt-6 text-center text-xs text-white/50">Prices in USD. Taxes may apply. Cancel anytime.</p>
</div>
</section>
);
}