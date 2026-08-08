import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { InstallPrompt } from "@/components/InstallPrompt";
import { NetworkBackground } from "@/components/NetworkBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ViewTransitions } from "@/components/ViewTransitions";
import { Scanlines } from "@/components/Scanlines";
import { Telemetry } from "@/components/Telemetry";
import { SectionNav } from "@/components/SectionNav";
import { TerminalOverlay } from "@/components/TerminalOverlay";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Syamsul — Portofolio",
  description: "Portofolio pribadi Syamsul, Pengembang Full-Stack",
  metadataBase: new URL("https://boundless.my.id"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Syamsul — Portofolio",
    description: "Portofolio pribadi Syamsul, Pengembang Full-Stack",
    url: "https://boundless.my.id",
    siteName: "Syamsul",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#0d9488",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <NetworkBackground />
        <SmoothScroll />
        <ViewTransitions />
        <ScrollProgress />
        <LoadingScreen />
        <CustomCursor />
        <Scanlines />
        <div aria-hidden="true" className="noise pointer-events-none fixed inset-0 z-[15] opacity-[0.035]" />
        <Providers>
          <Navbar />
          <main className="relative z-10 min-h-screen pb-20 md:pb-0">{children}</main>
          <Footer />
        </Providers>
        <BackToTop />
        <Telemetry />
        <SectionNav />
        <TerminalOverlay />
        <InstallPrompt />
      </body>
    </html>
  );
}
