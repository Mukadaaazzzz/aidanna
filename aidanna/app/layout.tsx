import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Aidanna — Story-based learning",
  description: "Aidanna helps you learn with stories.",
  keywords: ["Aidanna", "story-based learning", "AI", "Edtech", "adaptive learning"],
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "64x64" }, // 👈 bigger and sharper
    ],
  },
  openGraph: {
    title: "Aidanna — story-based Learning AI",
    description: "Aidanna helps you learn through immersive storytelling.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.className} bg-neutral-950`}>
      <body className="min-h-dvh bg-gradient-to-b from-neutral-950 via-neutral-950 to-black text-white antialiased overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
