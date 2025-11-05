"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
      <AnimatedBackground />

      {/* Mobile: Floating portraits in corners */}
      <div className="absolute inset-0 sm:hidden">
        {people.slice(0, 4).map((p, i) => {
          const mobilePositions = [
            "left-3 top-16",
            "right-3 top-12",
            "left-2 bottom-16",
            "right-2 bottom-12"
          ];
          const mobileRotations = ["-12", "10", "-8", "12"];
          const mobileSizes = ["w-28", "w-32", "w-28", "w-32"];
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: parseInt(mobileRotations[i])
              }}
              transition={{ 
                duration: 0.7, 
                delay: 0.4 + i * 0.15,
                type: "spring",
                stiffness: 100
              }}
              className={`absolute ${mobilePositions[i]} ${mobileSizes[i]} aspect-[3/4] overflow-hidden rounded-2xl border-2 border-gray-200 shadow-2xl shadow-purple-500/20`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="128px"
                className="object-cover"
                priority={i < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 via-transparent to-transparent" />
            </motion.div>
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
            "right-[12%] bottom-[22%]"
          ];
          const rotations = ["-8", "6", "-5", "7"];
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              className={`absolute ${positions[i]} aspect-[3/4] w-24 overflow-hidden rounded-xl border border-gray-200 shadow-2xl shadow-purple-500/15 md:w-28 lg:w-32 xl:w-36`}
              style={{ transform: `rotate(${rotations[i]}deg)` }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 144px"
                className="object-cover"
                priority={i < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/25 via-transparent to-transparent" />
            </motion.div>
          );
        })}
      </div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative z-10 max-w-4xl"
      >
        <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Study smarter{" "}
          <br className="hidden sm:block" />
          with{" "}
          <span className="relative inline-block">
            <span className="bg-purple-400  bg-clip-text text-transparent">
              stories
            </span>
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5C40 2 80 3 100 4C120 5 160 6 198 4"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </motion.svg>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:mt-6 sm:text-lg md:text-xl"
        >
          From boring books to stories you'll love. Transform any topic into
          <br className="hidden sm:block" />
          captivating narratives that make learning unforgettable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 sm:mt-10"
        >
          <Link
            href="/app"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 sm:w-auto"
          >
            Try Aidanna
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50" />
      
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-purple-300 blur-3xl will-change-transform"
      />
      
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-pink-300 blur-3xl will-change-transform"
      />
      
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
        className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-orange-300 blur-3xl will-change-transform"
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf610_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf610_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.5)_100%)]" />
    </div>
  );
}