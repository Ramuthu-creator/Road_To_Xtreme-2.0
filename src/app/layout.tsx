import "../styles/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Orbitron, Space_Grotesk } from "next/font/google";
import Preloader from "@/components/animations/xtremepreloader";
import Navbar from "@/components/sections/navbar/Navbar";
import Footer from "@/components/sections/footer/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
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
  title: "Road To Xtreme 2.0",
  description: "Outthink the challenge. Outcode the competition.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${spaceGrotesk.variable}`}>
      <body className={`${inter.className} bg-[#0a0a0b] text-white selection:bg-[#ff5500] selection:text-black antialiased overflow-x-hidden flex flex-col min-h-screen`}>
        <Preloader>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </Preloader>
      </body>
    </html>
  );
}

