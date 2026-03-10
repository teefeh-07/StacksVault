import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StacksVault — Decentralized Micro-Savings on Bitcoin",
  description:
    "Create personal savings goals secured by Bitcoin. Set targets, track progress, and achieve your financial milestones — all on-chain with Stacks smart contracts.",
  keywords: [
    "Stacks",
    "Bitcoin",
    "DeFi",
    "Savings",
    "Smart Contracts",
    "Clarity",
    "Web3",
    "Decentralized Finance",
  ],
  openGraph: {
    title: "StacksVault — Decentralized Micro-Savings on Bitcoin",
    description:
      "Create personal savings goals secured by Bitcoin. Set targets, track progress, and achieve your financial milestones — all on-chain.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
