import type { Metadata } from "next";

import "@/app/globals.css";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "year progress",
  description: "A simple snapshot of the year’s progress.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
