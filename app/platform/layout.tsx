"use client"

import "../globals.css";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { TopBar } from "@/components/Structure/TopBar";
import { LeftPanel } from "@/components/Structure/LeftPanel";
import { useState } from 'react';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable
        )}
      >
        <div id="main" className="main-container">
          <TopBar />
          <div id="main-content" className="main-content">
            <LeftPanel selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            <div id="right-panel" className="right-panel">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}