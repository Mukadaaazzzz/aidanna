"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, Play, LucideIcon } from "lucide-react";

type StoryMode = "narrative" | "dialogue" | "case-study" | "interactive";

interface ModeInfo {
  icon: LucideIcon;
  title: string;
  description: string;
  example: string;
}

const modeData: Record<StoryMode, ModeInfo> = {
  narrative: {
    icon: BookOpen,
    title: "Narrative",
    description: "Character-driven stories that make concepts stick",
    example: "Follow a water droplet's journey through the cycle"
  },
  dialogue: {
    icon: Users,
    title: "Dialogue", 
    description: "Learn through conversations between perspectives",
    example: "Two economists debate market regulations"
  },
  "case-study": {
    icon: FileText,
    title: "Case Study",
    description: "Real scenarios with analysis and outcomes",
    example: "Johnson & Johnson's Tylenol crisis response"
  },
  interactive: {
    icon: Play,
    title: "Interactive",
    description: "Make choices and see consequences unfold",
    example: "Navigate a project crisis as team lead"
  }
};

export default function StoryModes() {
  const [activeMode, setActiveMode] = useState<StoryMode>("narrative");
  const currentMode = modeData[activeMode];

  return (
    <section id="modes" className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Pick your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">story mode</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Every topic, told four different ways
          </p>
        </div>

        <div className="mt-12 sm:mt-16">
          {/* Mode Selector */}
          <div className="flex flex-wrap justify-center gap-3">
            {(Object.keys(modeData) as StoryMode[]).map((mode) => {
              const modeInfo = modeData[mode];
              const IconComponent = modeInfo.icon;
              
              return (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`flex items-center gap-2.5 rounded-full px-5 py-3 transition-all ${
                    activeMode === mode
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm font-semibold">{modeInfo.title}</span>
                </button>
              );
            })}
          </div>

          {/* Mode Content */}
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-12 max-w-3xl"
          >
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-8 sm:p-10">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <currentMode.icon className="h-7 w-7 text-purple-600" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentMode.title}</h3>
                    <p className="mt-1.5 text-base text-gray-600">{currentMode.description}</p>
                  </div>
                  
                  <div className="rounded-xl bg-purple-50 p-4 border border-purple-100">
                    <p className="text-sm font-medium text-purple-700">Example</p>
                    <p className="mt-1 text-gray-700 italic">"{currentMode.example}"</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}