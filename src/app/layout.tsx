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
  other: {
    "talentapp:project_verification": "9fd7b68bb260ae23e484ca96b38d31b6c2a63465a59b536dca4c36244e0b57d58be5584883fe8ee80a102d16b9587d613dcb0c92de8772224ab42cec72bcdb50",
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
