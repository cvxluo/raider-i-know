import { Inter } from "next/font/google";
import { Providers } from "./providers";
import React from "react";
import NavBar from "@/components/NavBar";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Raider I Know",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavBar />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
