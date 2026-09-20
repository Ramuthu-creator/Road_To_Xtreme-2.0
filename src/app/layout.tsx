import "../styles/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Preloader from "@/components/animations/xtremepreloader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Road To Xtreme 2.0",
  description: "Next.js Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Preloader>{children}</Preloader>
      </body>
    </html>
  );
}
