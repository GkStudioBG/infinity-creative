import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Infinity Creative | Design Services in 48 Hours",
  description:
    "Professional design services delivered in 48 hours. No meetings, no scope creep. Just quality design.",
  keywords: ["design", "logo", "branding", "social media", "graphics"],
  authors: [{ name: "Infinity Creative Ltd" }],
  openGraph: {
    type: "website",
    title: "Infinity Creative | Design Services in 48 Hours",
    description:
      "Professional design services delivered in 48 hours. No meetings, no scope creep. Just quality design.",
    siteName: "Infinity Creative",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

// Script to prevent flash of unstyled content (FOUC) for theme
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
