"use client";
import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";

import Modes from "./components/Modes";
import Features from "./components/Features";

import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";


export default function Page() {
return (
<div className="min-h-dvh text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-100">
<Header />
<main>
<Hero />
<Modes />
<Features />
<Pricing />
<Testimonials />

<CTA />
</main>
<Footer />
</div>
);
}