import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import DonationSection from '@/components/DonationSection';
import { getSiteTextMap } from '@/lib/services/site-text.service';
import { connection } from 'next/server';

// SEO Metadata: Sayfa bazlı dinamik metadata
export const metadata = {
  title: 'Bağış ve Dayanışma',
  description: 'Karabük Eflani Hayır Kervanı Vakfının güncel bağış yöntemleri hakkında bilgi alın.',
  alternates: {
    canonical: '/bagis',
  },
};

// Next.js'in aradığı zorunlu "default export" yapısı
export default async function BagisPage() {
  await connection();
  let texts = {};
  try { texts = await getSiteTextMap(); } catch { texts = {}; }
  return (
    <main className="py-12 bg-eflavKrem">
      <Container>
        {/* Sayfa Başlığı ve Kısa Bilgi */}
        <div className="text-center mb-10">
          <SectionTitle 
            title={texts['donation.page.title'] || 'Bağış Yapın'}
            subtitle={texts['donation.page.subtitle'] || 'Geleceğe Umut Olun'}
            titleAs="h1"
          />
          <p className="mt-4 text-eflavMetinAcik max-w-2xl mx-auto text-base sm:text-lg">
            {texts['donation.page.intro'] || 'Eğitim, sosyal yardım, sağlık, kültürel miras ve toplumsal kalkınma çalışmalarımıza destek vererek dayanışma zincirinin bir halkası olabilirsiniz.'}
          </p>
        </div>

        {/* Mevcut Hazır Bağış Bileşeniniz */}
        <DonationSection texts={texts} />
      </Container>
    </main>
  );
}
