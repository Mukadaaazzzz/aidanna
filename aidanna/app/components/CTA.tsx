import React from "react";
import Link from "next/link";


export default function CTA() {
return (
<section className="py-20">
<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
<div className="relative overflow-hidden rounded-3xl border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-600/20 via-violet-600/10 to-sky-600/10 p-8 text-center shadow-2xl">
<h3 className="text-2xl font-semibold sm:text-3xl">Ready to learn at <span className="text-fuchsia-300">warp speed</span>?</h3>
<p className="mx-auto mt-2 max-w-2xl text-white/70">Pick a mode and let Aidanna guide you—like a teacher who truly gets you.</p>
<div className="mt-6 flex flex-wrap justify-center gap-3">
<Link href="#pricing" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg hover:bg-white/90">Start Free</Link>
<Link href="#modes" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">See Modes</Link>
</div>
</div>
</div>
</section>
);
}