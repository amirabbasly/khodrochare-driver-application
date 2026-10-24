import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PwaBootstrap, SplashGate } from "@/components/AppExperience";
import "./globals.css";
import "./driver.css";

export const metadata: Metadata = {
  title: "خودرو چاره | ناوگان امداد و سفیران",
  description: "دریافت بار، تالار ایرانشهر، قطعات یدکی و خدمات ویژهٔ ناوگان امداد و سفیران خودرو چاره.",
  applicationName: "خودرو چاره · ناوگان",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "خودرو چاره ناوگان",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#112a38",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <PwaBootstrap />
        <SplashGate>{children}</SplashGate>
      </body>
    </html>
  );
}
