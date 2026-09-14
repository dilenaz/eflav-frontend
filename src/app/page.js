// src/app/page.js

import Hero from "@/components/Hero";
import AboutPreview from "@/components/AboutPreview";
import ActivitiesSection from "@/components/activities/ActivitiesSection";
import GalleryPreview from "@/components/GalleryPreview";
import NewsSection from "@/components/NewsSection";
import ApplicationSection from "@/components/ApplicationSection";
import DonationSection from "@/components/DonationSection";
import { getFallbackContentPage } from "@/data/fallback-content";
import { getContentPagesBySlugs } from "@/lib/services/content-page.service";
import { getSiteTextMap } from "@/lib/services/site-text.service";
import { connection } from "next/server";

export const metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  await connection();
  const corporateSlugs = ['ana-sayfa-hakkinda', 'amac', 'misyon-vizyon'];
  let corporatePages = [];
  let siteTexts = {};
  try {
    [corporatePages, siteTexts] = await Promise.all([
      getContentPagesBySlugs(corporateSlugs),
      getSiteTextMap(),
    ]);
  } catch {
    corporatePages = [];
    siteTexts = {};
  }
  const corporateContent = Object.fromEntries(corporateSlugs.map((slug) => [
    slug,
    corporatePages.find((page) => page.slug === slug) || getFallbackContentPage(slug),
  ]));

  return (
    <main className="pt-0">
      <Hero corporateContent={corporateContent} texts={siteTexts} />
      <AboutPreview page={corporateContent['ana-sayfa-hakkinda']} />
      <ActivitiesSection texts={siteTexts} />
      <GalleryPreview texts={siteTexts} />
      <NewsSection texts={siteTexts} />
      <ApplicationSection texts={siteTexts} />
      <DonationSection texts={siteTexts} />
    </main>
  );
}
