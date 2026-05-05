import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { SidebarProvider } from "@/lib/shared/context/SidebarContext";

const geistSans = localFont({
  src: [
    { path: "../public/fonts/geist-latin.woff2", weight: "100 900" },
    { path: "../public/fonts/geist-latin-ext.woff2", weight: "100 900" },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    { path: "../public/fonts/geist-mono-latin.woff2", weight: "100 900" },
    { path: "../public/fonts/geist-mono-latin-ext.woff2", weight: "100 900" },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Help Desk - Pro Servicio",
  description: "Sistema de mesa de ayuda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SidebarProvider>
          <AuthProvider>{children}</AuthProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
