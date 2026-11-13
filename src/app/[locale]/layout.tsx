import { LearningSaveNotice } from "@/components/layout/LearningSaveNotice";
import type { Metadata } from "next";
import { Inter, Manrope, Noto_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { locales, localeTags } from "@/i18n/config";
import { getDictionary, resolveLocale } from "@/i18n/dictionaries";
import { PublicLayoutChrome } from "@/components/layout/PublicLayoutChrome";

const brandFont = Plus_Jakarta_Sans({
  variable: "--font-brand",
  subsets: ["latin", "cyrillic-ext"],
  weight: ["700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL("https://chemlab.kg"),
    title: dict.meta.title,
    description: dict.meta.description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/branding/chemlab-icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/branding/chemlab-icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/branding/chemlab-icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/branding/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
    },
    manifest: "/site.webmanifest",
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: "ChemLab KG",
      images: [
        {
          url: "/branding/chemlab-kg-horizontal-white.jpg",
          width: 1200,
          height: 630,
          alt: "ChemLab KG",
        },
      ],
    },
  };
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = await getDictionary(locale);

  return (
    <html
      lang={localeTags[locale]}
      className={`${brandFont.variable} ${manrope.variable} ${inter.variable} ${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PublicLayoutChrome locale={locale} dict={dict}>
          {children}
        </PublicLayoutChrome>
        <LearningSaveNotice locale={locale} />
      </body>
    </html>
  );
}
