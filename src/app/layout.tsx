import type { Metadata, Viewport } from "next";
import { Anybody, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const anybody = Anybody({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-anybody"
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken"
});

export const metadata: Metadata = {
  title: "Copa 2026 Album",
  description: "Troca de figurinhas da Copa do Mundo 2026 entre vizinhos."
};

export const viewport: Viewport = {
  themeColor: "#006b25",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${anybody.variable} ${hanken.variable}`}>
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
