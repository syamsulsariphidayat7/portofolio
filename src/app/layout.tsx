import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { InstallPrompt } from "@/components/InstallPrompt";
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
        <ScrollProgress />
        <LoadingScreen />
        <Providers>
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <Footer />
        </Providers>
        <BackToTop />
        <InstallPrompt />
      </body>
    </html>
  );
}
