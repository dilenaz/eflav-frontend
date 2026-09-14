import Container from '@/components/ui/Container';

export default function Loading() {
  return (
    <main className="min-h-screen bg-eflavKrem py-20">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-eflavSinir bg-white p-12 shadow-sm">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-eflavSinir border-t-eflavBordo" />

          <h1 className="mt-8 text-2xl font-bold text-eflavAntrasit">
            Yükleniyor...
          </h1>

          <p className="mt-3 text-center leading-7 text-eflavMetinAcik">
            Lütfen bekleyiniz. İçerik hazırlanıyor.
          </p>
        </div>
      </Container>
    </main>
  );
}