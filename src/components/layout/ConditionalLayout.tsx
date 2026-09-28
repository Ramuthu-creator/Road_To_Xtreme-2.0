"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/sections/navbar/Navbar";
import Footer from "@/components/sections/footer/Footer";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide Navbar on all admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  
  return <Navbar />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide Footer on all admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  
  return <Footer />;
}
