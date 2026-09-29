"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/sections/navbar/Navbar";
import Footer from "@/components/sections/footer/Footer";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide Navbar on admin and registration routes
  if (
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/session-registration") ||
    pathname?.startsWith("/registration")
  ) {
    return null;
  }
  
  return <Navbar />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide Footer on admin and registration routes
  if (
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/session-registration") ||
    pathname?.startsWith("/registration")
  ) {
    return null;
  }
  
  return <Footer />;
}
