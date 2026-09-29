import "../styles/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Orbitron, Space_Grotesk } from "next/font/google";

import Preloader from "@/components/animations/xtremepreloader";
// import Navbar from "@/components/sections/navbar/Navbar";
// import Footer from "@/components/sections/footer/Footer";
// import Guidence from "@/components/sections/guidance-resources/HowItWorks";
import { ConditionalNavbar, ConditionalFooter } from "@/components/layout/ConditionalLayout";
import CustomCursor from "@/components/animations/customCursor";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "600", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CINEC IEEE Road to Xtreme 2.0",
  description: "Join CINEC IEEE Road to Xtreme 2.0, the ultimate algorithmic coding competition designed to prepare Sri Lankan undergraduates for IEEEXtreme.",
  keywords: ["IEEE", "IEEEXtreme", "CINEC", "Coding Competition", "Road to Xtreme 2.0", "Sri Lanka", "Hackathon", "Algorithms"],
  authors: [{ name: "CINEC IEEE Student Branch" }],
  openGraph: {
    title: "CINEC IEEE Road to Xtreme 2.0",
    description: "Outthink the challenge. Outcode the competition. The premier algorithmic coding preparation event hosted by CINEC IEEE Student Branch.",
    url: "https://road-to-xtreme-2.web.app", // Update this with your actual production URL later
    siteName: "CINEC IEEE Road to Xtreme 2.0",
    images: [
      {
        url: "/assets/logos/xtreme-logo.png", // Update this with your actual logo path in public/assets/
        width: 1200,
        height: 630,
        alt: "CINEC IEEE Road to Xtreme 2.0 Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CINEC IEEE Road to Xtreme 2.0",
    description: "Outthink the challenge. Outcode the competition.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${orbitron.variable} ${spaceGrotesk.variable}`}>
    
        
      <body className={`${inter.className} bg-[#0a0a0b] text-white selection:bg-[#ff5500] selection:text-black antialiased overflow-x-clip flex flex-col min-h-screen`}>
        <CustomCursor />
        <Preloader>
          <ConditionalNavbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <ConditionalFooter />
        </Preloader>
      </body>
    </html>
  );
}