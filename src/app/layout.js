import SiteChrome from "@/components/SiteChrome";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eflanihayirkervanivakfi.com";
const siteName = "Karabük Eflani Hayır Kervanı Vakfı";
const siteDescription = "Karabük Eflani Hayır Kervanı Vakfı; sosyal yardım, eğitim, sağlık, kültürel miras ve toplumsal kalkınma çalışmalarıyla dayanışmayı güçlendirir.";

export const metadata = {
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  keywords: [siteName, "Eflani", "Karabük", "Eflani Vakfı", "eğitim desteği", "sosyal yardım", "hayır vakfı"],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteName }],
  },
  twitter: { card: "summary_large_image", title: siteName, description: siteDescription, images: ["/opengraph-image"] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head><OrganizationJsonLd /></head>
      <body className="bg-white text-eflavMetin antialiased">
        <SiteChrome year={new Date().getFullYear()}>{children}</SiteChrome>
      </body>
    </html>
  );
}
