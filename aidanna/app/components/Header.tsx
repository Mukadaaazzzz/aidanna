"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X, Users, FileText } from "lucide-react";
import { Poppins } from "next/font/google"; // ⬅️ Import Poppins
import logoPng from "@/public/logo.png";

// ⬇️ Configure the Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"], // SemiBold–ExtraBold range for logo
});

export default function Header() {
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "#pricing", label: "Pricing", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link href="/" className="flex items-center group">
          <Image
            src={logoPng}
            alt="Aidanna - Learn Through Stories"
            width={40}
            height={40}
            priority
            className="rounded-lg transition-transform group-hover:scale-105"
          />
          <span
            className={`${poppins.className}  text-xl sm:text-1xl tracking-tight text-gray-800 transition-colors group-hover:text-purple-600`}
          >
            Aidanna
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm text-gray-600 transition-all hover:text-purple-600 hover:scale-105"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Link
            href="/signin"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-purple-600 hover:to-fuchsia-600 hover:shadow-purple-500/25"
          >
            SignIn <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          aria-label="Open menu"
          className="lg:hidden p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6 lg:px-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/signin"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 font-semibold text-white transition hover:from-purple-600 hover:to-fuchsia-600"
            >
              SignIn <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
