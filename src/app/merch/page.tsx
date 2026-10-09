import type { Metadata } from "next";
import MerchPage from "@/components/sections/merch/merchPage";

export const metadata: Metadata = {
  title: "Merch | Road to Xtreme 2.0",
  description:
    "Explore the Road to Xtreme polo. Choose your view, size and quantity.",
};

export default function Page() {
  return <MerchPage />;
}