import type { Metadata } from "next";
import { Archivo, Geist, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { noFlashScript } from "@/lib/settings-store";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Stand-in for Commit Mono, which is not distributed via Google Fonts.
 * `--font-mono` in globals.css points here for now; swap in a
 * next/font/local Commit Mono declaration once the font files are vendored
 * and repoint that one variable — no other file needs to change.
 */
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Display face for the boot logo and stack-card monograms only. Google's
 * variable Archivo exposes both the wght and wdth axes, so we pull the
 * width axis in to get the wide, heavy treatment the design calls for.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anubhav Mishra",
  description:
    "Portfolio of Anubhav Mishra, a full-stack developer and 3rd-year CS student, built as a desktop-operating-system metaphor.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-accent="system"
      className={`${geistSans.variable} ${jetBrainsMono.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="no-flash-theme" strategy="beforeInteractive">
          {noFlashScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
