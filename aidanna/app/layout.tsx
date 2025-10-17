import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
title: "Aidanna — Emotionally Intelligent Learning",
description: "Aidanna is the first emotionally intelligent, invisible teacher.",
keywords: [
"Aidanna",
"emotionally intelligent learning",
"mindmaps",
"flashcards",
"adaptive challenges",
],
openGraph: {
title: "Aidanna — Emotionally Intelligent Learning",
description:
"Aidanna is the first emotionally intelligent, invisible teacher that adapts to you.",
type: "website",
},
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en" className="bg-neutral-950">
<body className="min-h-dvh bg-gradient-to-b from-neutral-950 via-neutral-950 to-black text-white antialiased overflow-x-clip">
{children}
</body>
</html>
);
}