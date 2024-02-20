import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Teller",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} container mx-auto flex min-h-screen flex-col gap-4 font-sans`}
      >
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
