import React from "react";
import { Brain, Sparkles, Wand2, FileText, Compass, Crown } from "lucide-react";

export default function Features() {
  const features = [
    { icon: Brain, title: "Emotionally Aware", desc: "Adapts to your tone and motivation" },
    { icon: Sparkles, title: "Multisensory", desc: "Audio, visuals, and interactions" },
    { icon: Wand2, title: "Auto Flashcards", desc: "Spaced repetition from any topic" },
    { icon: FileText, title: "Upload & Learn", desc: "PDFs, docs, and notes digested" },
    { icon: Compass, title: "Real Scenarios", desc: "Practice with interactive sims" },
    { icon: Crown, title: "Track Progress", desc: "Celebrate milestones as you grow" },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Learning that feels <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">effortless</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">Powerful features, zero friction</p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div 
              key={title} 
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 p-2.5">
                <Icon className="h-5 w-5 text-fuchsia-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-1.5 text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}