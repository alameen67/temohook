import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Temphook - Next-Gen Temporary Email",
  description: "Secure, fast, and beautiful disposable email platform. Protect your privacy with Temphook.",
  openGraph: {
    title: "Temphook - Next-Gen Temporary Email",
    description: "Secure, fast, and beautiful disposable email platform.",
    url: "https://temphook.lol",
    siteName: "Temphook",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Temphook - Temporary Email",
    description: "Secure, fast, and beautiful disposable email platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground overflow-x-hidden`}>
        {/* Animated background element */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        {children}
      </body>
    </html>
  );
}
