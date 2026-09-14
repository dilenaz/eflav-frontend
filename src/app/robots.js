// src/app/robots.js

export default function robots() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://eflanihayirkervanivakfi.com").replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/", // Yönetim paneli arama sonuçlarında çıkmamalı
        "/api/",   // Veritabanı API istek yolları gizli kalmalı
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
