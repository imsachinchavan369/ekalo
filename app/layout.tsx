import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "EKALO | India's Digital Talent Economy",
  description: "Compete in live digital talent challenges, get ranked fairly, and win real rewards.",
  openGraph: {
    title: "EKALO | India's Digital Talent Economy",
    description: "Win money with your talent through live creator challenges.",
    images: ["/images/reference/hero-reference.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
