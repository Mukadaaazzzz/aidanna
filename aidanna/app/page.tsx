"use client";
import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Trustbar from "./components/Trustbar";
import Modes from "./components/Modes";
import Features from "./components/Features";
import ImmersionUpload from "./components/ImmersionUpload";
import MindmapFlashcards from "./components/MindMapFlashcards";
import Challenge from "./components/Challenge";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";


export default function Page() {
return (
<div className="min-h-dvh bg-gradient-to-b from-neutral-950 via-neutral-950 to-black text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-100">
<Header />
<main>
<Hero />
<Trustbar />
<Modes />
<Features />
<ImmersionUpload />
<MindmapFlashcards />
<Challenge />
<Pricing />
<Testimonials />
<FAQ />
<CTA />
</main>
<Footer />
</div>
);
}