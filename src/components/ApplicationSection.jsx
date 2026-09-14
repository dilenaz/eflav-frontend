import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const applicationTypes = [
  {
    title: 'Sosyal Destek',
    description: 'Sosyal destek talepleri insan onuruna saygılı, adil ve gizliliği gözeten bir yaklaşımla değerlendirilir.',
  },
  {
    title: 'Gönüllülük',
    description: 'Eğitim, sosyal yardım, kültür ve saha çalışmalarımıza gönüllü katkı sunabilirsiniz.',
  },
];

export default function ApplicationSection({ texts = {} }) {
  return (
    <section className="border-t border-eflavSinir bg-white py-20" aria-labelledby="applications-section-title">
      <Container>
        <SectionTitle
          id="applications-section-title"
          eyebrow={texts['home.applications.eyebrow'] || 'Dayanışmaya Katılın'}
          title={texts['home.applications.title'] || 'Başvuru ve Gönüllülük'}
          description={texts['home.applications.description'] || 'Başvuru dönemleri ve güncel koşullar duyurularımızda yayımlanır. Bilgi almak veya gönüllü olmak için bizimle iletişime geçebilirsiniz.'}
        />
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {applicationTypes.map((item, index) => (
            <Card key={item.title} className="flex h-full flex-col">
              <span className="text-sm font-black text-eflavAltin">0{index + 1}</span>
              <h3 className="mt-4 text-xl font-black text-eflavAntrasit">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-eflavMetinAcik">{item.description}</p>
            </Card>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button href="/basvurular" variant="primary">Başvuru Bilgilerini İnceleyin</Button>
          <Button href="/iletisim" variant="outline">Bilgi Alın</Button>
        </div>
      </Container>
    </section>
  );
}
