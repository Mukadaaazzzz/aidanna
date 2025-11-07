"use client";
import React, { useState } from "react";
import { BookOpen, Users, LucideIcon } from "lucide-react";

type StoryMode = "narrative" | "dialogue";

interface ModeInfo {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const modeData: Record<StoryMode, ModeInfo> = {
  narrative: {
    icon: BookOpen,
    title: "Narrative Stories",
    description: "Follow compelling characters and scenarios that bring concepts to life through vivid storytelling. Perfect for visual learners who love immersive experiences.",
    color: "purple"
  },
  dialogue: {
    icon: Users,
    title: "Dialogue Conversations", 
    description: "Learn through dynamic debates and discussions between different perspectives. Ideal for understanding complex topics from multiple angles.",
    color: "pink"
  }
};

export default function StoryModes() {
  const [activeMode, setActiveMode] = useState<StoryMode>("narrative");

  return (
    <section id="modes" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl">
            Choose your{" "}
            <span className="bg-purple-600 bg-clip-text text-transparent">
              learning style
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-400 sm:text-xl">
            Transform any topic into an engaging story format
          </p>
        </div>

        <div className="mt-16 sm:mt-20 grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
          {(Object.keys(modeData) as StoryMode[]).map((mode) => {
            const modeInfo = modeData[mode];
            const IconComponent = modeInfo.icon;
            const isActive = activeMode === mode;
            
            return (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`group relative overflow-hidden rounded-2xl p-8 text-left transition-all ${
                  isActive
                    ? "bg-gray-800 ring-2 ring-purple-500"
                    : "bg-gray-800 ring-2 ring-purple-500"
                }`}
              >
                <div className="relative">
                  <div className={`inline-flex items-center justify-center rounded-xl p-3 ${
                    isActive ? "bg-purple-500/20" : "bg-gray-700"
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      isActive ? "text-purple-400" : "text-gray-400"
                    }`} />
                  </div>
                  
                  <h3 className="mt-5 text-2xl font-bold text-white">
                    {modeInfo.title}
                  </h3>
                  
                  <p className="mt-3 text-base leading-relaxed text-gray-400">
                    {modeInfo.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}