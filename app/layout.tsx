import type { Metadata, Viewport } from "next";
import { Assistant } from "next/font/google";
import { InstallAppPrompt } from "@/components/install-app-prompt";
import "./globals.css";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "בת מלך - מערכת נוער חב\"ד",
  description: "מערכת ניהול לארגון נוער חב\"ד",
  icons: {
    icon: "/logo-bat-melech.png",
    apple: "/logo-bat-melech.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={assistant.variable}>
      <body className={`${assistant.className} min-h-screen overflow-x-hidden`}>
        {children}
        <InstallAppPrompt />
      </body>
    </html>
  );
}
