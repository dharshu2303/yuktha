import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/next";

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
    icon: "/logo.png",
    apple: "/logo.png",
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
        {/* Restrict Right Click */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                let toast = document.getElementById('rc-disabled-toast');
                if (!toast) {
                  toast = document.createElement('div');
                  toast.id = 'rc-disabled-toast';
                  toast.innerHTML = '<span style="font-size: 20px;">⚠️</span> <b>Right Click Disabled</b>';
                  Object.assign(toast.style, {
                    position: 'fixed',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(100px)',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px rgba(239, 68, 68, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: '999999',
                    fontFamily: 'sans-serif',
                    fontSize: '14px',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'none'
                  });
                  document.body.appendChild(toast);
                }
                
                // Show
                setTimeout(() => {
                  toast.style.transform = 'translateX(-50%) translateY(0)';
                }, 10);
                
                // Hide after 2 seconds
                clearTimeout(window.rcToastTimer);
                window.rcToastTimer = setTimeout(() => {
                  toast.style.transform = 'translateX(-50%) translateY(100px)';
                }, 2000);
              });
            `,
          }}
        />
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
        <Analytics />
      </body>
    </html>
  );
}
