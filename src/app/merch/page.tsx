import type { Metadata } from "next";
import MerchPage from "@/components/sections/merch/merchPage";

export const metadata: Metadata = {
  title: "Merch | Road to Xtreme 2.0",
  description:
    "Pre-order the official Road to Xtreme polo. Exclusive CINEC Campus Student Branch edition.",
};

export default function Page() {
  return (
    <MerchPage
      price={1800}
      preorderClosesAt="2026-10-16T23:59:59+05:30"
      googleFormUrl="https://docs.google.com/forms/d/e/1FAIpQLScotabcvcrfotx6qL9vsp_CPV3duoVTKccLQhq62ag0LlsZbw/viewform?usp=publish-editor"
    />
  );
}