import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "75 Flex",
  description: "75 Flex onboarding and product prototype"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
