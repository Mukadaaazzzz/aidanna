"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Github, Twitter, MessageSquare, Linkedin } from "lucide-react";
import logoPng from "@/public/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/aidanna", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/in/aidanna", label: "Linkedin" },
    { icon: Mail, href: "mailto:mukadaz@aidanna.com", label: "Email" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center">
          <Image
            src={logoPng}
            alt="Aidanna Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold text-gray-900">Aidanna</span>
        </div>

        {/* Social */}
        <div className="flex gap-4">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="p-2 rounded-md border border-gray-200 hover:border-purple-400 hover:text-purple-600 transition-all"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 py-6 text-sm text-center text-gray-500">
        © {currentYear} Aidanna — Made with 💜 for curious minds.
      </div>
    </footer>
  );
}
