import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import NavWrapper from "./components/navigation/nav-wrapper";
import { Toaster } from "@/components/ui/sooner"
import Footer from "./components/footer";

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'NSA — Premium Sports Jerseys & Apparel',
  description: 'NSA delivers premium sports jerseys and accessories for athletes and streetwear enthusiasts who demand elite quality and uncompromising style.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} antialiased`}>
        <NavWrapper />
        <div className="w-full">
          {children}
        </div>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}