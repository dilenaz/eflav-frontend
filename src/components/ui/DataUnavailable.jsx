import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function DataUnavailable({ title = 'İçerik geçici olarak kullanılamıyor', backHref = '/', backLabel = 'Ana Sayfaya Dön' }) {
  return (
    <main className="flex min-h-[70vh] items-center bg-eflavKrem py-20">
      <Container>
        <div role="status" className="mx-auto max-w-2xl rounded-3xl border border-eflavSinir bg-white p-10 text-center shadow-sm">
          <span className="text-5xl" aria-hidden="true">⏳</span>
          <h1 className="mt-6 text-3xl font-black text-eflavAntrasit">{title}</h1>
          <p className="mt-5 leading-8 text-eflavMetinAcik">
            Genel bilgiler ve diğer sayfalar kullanılabilir durumda. Güncel kayıtlar yeniden bağlandığında bu içerik otomatik olarak görüntülenecektir.
          </p>
          <Button href={backHref} className="mt-8">{backLabel}</Button>
        </div>
      </Container>
    </main>
  );
}
