// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Explorer",
  description: "Explore movies and TV shows built with Next.js and TMDB API",
  // MODIFIED ICONS METADATA BLOCK
  icons: {
    icon: [
      // Link to the favicon.png in the public directory
{ url: '/favicon.png', type: 'image/png', sizes: '32x32' }, 
      // You can also add a 16x16 version if you have one
      // { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    // Optional: for Apple devices
    apple: '/apple-icon.png', // If you have an apple-icon.png in public/
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}