import "./globals.css";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { StudySubsiteProvider } from "@/components/context/siteContext";
import { InsightsProvider } from "@/components/context/insightsContext"
import { VisualDataProvider } from "@/components/context/VisualDataContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MOLRA",
  description: "MOLRA",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <StudySubsiteProvider>
        <InsightsProvider>
        <VisualDataProvider>

          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
          </VisualDataProvider>
          </InsightsProvider>
        </StudySubsiteProvider>
        
      </body>
    </html>
  );
}
