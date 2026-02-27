import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blackjack Evaluator",
  description: "Train blackjack play with basic strategy and counting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-emerald-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

