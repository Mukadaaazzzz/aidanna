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
        {/* Hero with immediate background - no delay */}
        <div 
          className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
          style={{
            // Inline styles for instant rendering before React hydrates
            background: 'linear-gradient(to bottom right, rgb(250 245 255), rgb(252 231 243), rgb(255 237 213))'
          }}
        >
          <Hero />
        </div>
        
        {/* Dark sections start here */}
        <div className="bg-gradient-to-b from-neutral-950 via-neutral-950 to-black">
          <Modes />
          <Features />
          <Pricing />
          <Testimonials />
          <CTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}