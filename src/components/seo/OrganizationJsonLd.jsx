const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eflanihayirkervanivakfi.com').replace(/\/$/, '');

export default function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': `${siteUrl}/#organization`,
    name: 'Karabük Eflani Hayır Kervanı Vakfı',
    url: siteUrl,
    logo: `${siteUrl}/images/logo/eflanilogo.png`,
    email: 'karabukeflanivakfi@gmail.com',
    telephone: '+90 545 379 03 06',
    address: { '@type': 'PostalAddress', streetAddress: 'Pelitli Mahallesi, Mollafenari Caddesi No:86', addressLocality: 'Gebze', addressRegion: 'Kocaeli', addressCountry: 'TR' },
    areaServed: { '@type': 'AdministrativeArea', name: 'Eflani, Karabük' },
    sameAs: ['https://www.instagram.com/karabukeflanivakfi/', 'https://www.facebook.com/people/Karab%C3%BCk-Eflani-Vakf%C4%B1/100089528226678/'],
    nonprofitStatus: 'NonprofitType',
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
