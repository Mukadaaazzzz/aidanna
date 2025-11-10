"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Static imports for instant loading (Next.js auto-optimizes these at build time)
// Use relative paths from your components folder
import person1 from "@/public/people/person1.jpg";
import person2 from "@/public/people/person2.jpg";
import person3 from "@/public/people/person3.jpg";
import person4 from "@/public/people/person4.jpg";

export default function Hero() {
  const people = [
    { src: person1, alt: "Smiling learner" },
    { src: person2, alt: "Focused student" },
    { src: person3, alt: "Joyful reader" },
    { src: person4, alt: "Creative thinker" },
  ];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 px-4 py-16 text-center text-gray-900 sm:px-6 lg:px-8">
      {/* Mobile: Floating portraits */}
      <div className="absolute inset-0 sm:hidden">
        {people.slice(0, 4).map((p, i) => {
          const mobilePositions = [
            "left-3 top-16",
            "right-3 top-12",
            "left-2 bottom-16",
            "right-2 bottom-12"
          ];
          const mobileRotations = ["-12deg", "10deg", "-8deg", "12deg"];
          const mobileSizes = ["w-32", "w-36", "w-32", "w-36"];
          
          return (
            <div
              key={i}
              className={`absolute ${mobilePositions[i]} ${mobileSizes[i]} aspect-[3/4] overflow-hidden rounded-2xl border-2 border-white/50 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100`}
              style={{ transform: `rotate(${mobileRotations[i]})` }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="144px"
                className="object-cover"
                priority
                quality={75}
                placeholder="blur"
              />
            </div>
          );
        })}
      </div>

      {/* Desktop: Floating portraits */}
      <div className="absolute inset-0 hidden sm:block">
        {people.map((p, i) => {
          const positions = [
            "left-[8%] top-[20%]",
            "right-[10%] top-[18%]",
            "left-[12%] bottom-[25%]",
            "right-[14%] bottom-[25%]"
          ];
          const rotations = ["-8deg", "6deg", "-5deg", "7deg"];
          
          return (
            <div
              key={i}
              className={`absolute ${positions[i]} aspect-[3/4] w-24 overflow-hidden rounded-xl border-2 border-white/50 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100 md:w-28 lg:w-32 xl:w-36`}
              style={{ transform: `rotate(${rotations[i]})` }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 144px"
                className="object-cover"
                priority
                quality={75}
                placeholder="blur"
              />
            </div>
          );
        })}
      </div>

      {/* Text content */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Study smarter{" "}
          <br className="hidden sm:block" />
          with{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
              stories
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M2 5C40 2 80 3 100 4C120 5 160 6 198 4"
                stroke="#a855f7"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:mt-6 sm:text-lg md:text-xl">
          From boring books to stories you'll love. Transform any topic into
          <br className="hidden sm:block" />
          captivating narratives that make learning unforgettable.
        </p>

        <div className="mt-8 sm:mt-10">
          <Link
            href="/app"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 sm:w-auto"
          >
            Try Aidanna
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}