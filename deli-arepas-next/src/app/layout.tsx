import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deli Arepas JD",
  description: "Deli Arepas JD - Sabor tradicional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}