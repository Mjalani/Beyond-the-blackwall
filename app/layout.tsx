import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beyond the Blackwall",
  description: "An original cyberpunk serial novel presented as an interactive digital book."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
