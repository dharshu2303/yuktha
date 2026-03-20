import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Yuktha — Card to Website in Seconds",
  description:
    "AI-powered business card to website generator for Indian small business owners. Upload your card, get a professional website instantly.",
  keywords: "business card, website generator, AI, Indian business, free website",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg",
  },
  openGraph: {
    title: "Yuktha — Card to Website in Seconds",
    description: "Upload your business card. Get a professional website. Free.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A1A2E",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {/* Animated Background Orbs */}
        <div className="animated-bg" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        {/* App Content */}
        <LanguageProvider>
          <main className="app-container">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
