import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoPng from "@/public/logo.png";


export default function Footer() {
return (
<footer className="border-t border-white/10 py-10">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
<div className="space-y-3">
<Link href="#" className="flex items-center gap-3">
          {/* Avoid odd, non-tailwind sizes like h-15; rely on width/height */}
          <Image
            src={logoPng}
            alt="Aidanna"
            width={36}
            height={36}
            priority
            className="rounded"
          />
          <span className="font-semibold tracking-tight">Aidanna</span>
        </Link>
<p className="text-sm text-white/60">The emotionally intelligent learning companion.</p>
</div>
<div>
<p className="text-sm font-semibold">Product</p>
<ul className="mt-3 space-y-2 text-sm text-white/70">
<li><a href="#features" className="hover:text-white">Features</a></li>
<li><a href="#modes" className="hover:text-white">Modes</a></li>
<li><a href="#pricing" className="hover:text-white">Pricing</a></li>
</ul>
</div>
<div>
<p className="text-sm font-semibold">Resources</p>
<ul className="mt-3 space-y-2 text-sm text-white/70">
<li><a href="#faq" className="hover:text-white">FAQ</a></li>
<li><a href="#" className="hover:text-white">Docs</a></li>
<li><a href="#" className="hover:text-white">Community</a></li>
</ul>
</div>
<div>
<p className="text-sm font-semibold">Legal</p>
<ul className="mt-3 space-y-2 text-sm text-white/70">
<li><a href="#" className="hover:text-white">Privacy</a></li>
<li><a href="#" className="hover:text-white">Terms</a></li>
</ul>
</div>
</div>
<div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
<p>© {new Date().getFullYear()} Aidanna. All rights reserved.</p>
<p>Made for curious minds ✨</p>
</div>
</div>
</footer>
);
}