import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const metadata = (messages as { metadata?: { home?: { title?: string; description?: string } } }).metadata?.home;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://infinity-creative.pages.dev"
    ),
    title: metadata?.title || "Infinity Creative | Design Services in 48 Hours",
    description:
      metadata?.description ||
      "Professional design services delivered in 48 hours. No meetings, no scope creep. Just quality design.",
    keywords: [
      "design",
      "logo",
      "branding",
      "social media",
      "graphics",
      "design service",
      "productized service",
      "fast delivery",
    ],
    authors: [{ name: "Infinity Creative Ltd" }],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: locale === "bg" ? "bg_BG" : "en_US",
      url: "https://infinity-creative.pages.dev",
      title: metadata?.title || "Infinity Creative | Design Services in 48 Hours",
      description:
        metadata?.description ||
        "Professional design services delivered in 48 hours. No meetings, no scope creep. Just quality design.",
      siteName: "Infinity Creative",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Infinity Creative - Design Services",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata?.title || "Infinity Creative | Design Services in 48 Hours",
      description:
        metadata?.description ||
        "Professional design services delivered in 48 hours. No meetings, no scope creep. Just quality design.",
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        bg: "/bg",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
