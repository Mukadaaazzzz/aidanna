"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const people = [
    { src: "/people/person1.jpg", alt: "Smiling learner" },
    { src: "/people/person2.jpg", alt: "Focused student" },
    { src: "/people/person3.jpg", alt: "Joyful reader" },
    { src: "/people/person4.jpg", alt: "Creative thinker" },
  ];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 py-16 text-center text-gray-900 sm:px-6 lg:px-8">
      {/* Static background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf608_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf608_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

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
              className={`absolute ${mobilePositions[i]} ${mobileSizes[i]} aspect-[3/4] overflow-hidden rounded-2xl border-2 border-white/50 shadow-lg bg-white/80`}
              style={{ transform: `rotate(${mobileRotations[i]})` }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="128px"
                className="object-cover"
                priority={i < 2}
                quality={75}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-transparent" />
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
              className={`absolute ${positions[i]} aspect-[3/4] w-24 overflow-hidden rounded-xl border-2 border-white/50 shadow-lg bg-white/80 md:w-28 lg:w-32 xl:w-36`}
              style={{ transform: `rotate(${rotations[i]})` }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 144px"
                className="object-cover"
                priority={i < 2}
                quality={75}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/15 via-transparent to-transparent" />
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