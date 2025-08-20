import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GenZang | Next-Gen Programming Language for Gen Z",
  description:
    "GenZang is a fun, modern, and beginner-friendly programming language designed for the Gen Z mindset. Learn to code in a simple, relatable, and powerful way.",
  keywords: [
    "GenZang",
    "programming language",
    "Gen Z",
    "coding",
    "beginner-friendly",
    "modern language",
    "learn to code",
  ],
  authors: [{ name: "Sharmil Adroja" }],
  openGraph: {
    type: "website",
    url: "https://genzang.dev/",
    title: "GenZang | Next-Gen Programming Language for Gen Z",
    description:
      "Learn coding the Gen Z way with GenZang — a modern, fun, and beginner-friendly programming language.",
    images: ["https://genzang.dev/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GenZang | Next-Gen Programming Language for Gen Z",
    description:
      "Learn coding the Gen Z way with GenZang — a modern, fun, and beginner-friendly programming language.",
    images: ["https://genzang.dev/og-image.png"],
    site: "@Sharmil001",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://genzang.dev/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased dark`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
