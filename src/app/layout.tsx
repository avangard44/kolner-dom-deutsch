import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WortMeister | Görsel Hafıza & Artikel Renk Kodlu Almanca Kelime Stüdyosu",
  description:
    "Türkçe konuşanlar için A1-B2 seviyesinde en sık kullanılan 3000-4000 Almanca kelimeyi artikel renk kodları, gerçek Wikipedia görselleri, 3D kartlar ve interaktif testlerle öğrenme uygulaması.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  );
}
