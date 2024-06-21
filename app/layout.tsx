import "./globals.css";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Canopy | The biodiversity community building the future",
  description: "Canopy is a platform for building and sharing biodiversity data.",
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
        
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
        
      </body>
    </html>
  );
}
