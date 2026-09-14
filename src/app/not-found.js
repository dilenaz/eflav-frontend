import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Sayfa Bulunamadı',
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-eflavKrem py-20">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-eflavSinir bg-white p-10 text-center shadow-sm">
          <span className="text-7xl font-black text-eflavBordo">404</span>

          <h1 className="mt-6 text-3xl font-black text-eflavAntrasit">
            Aradığınız sayfa bulunamadı.
          </h1>

          <p className="mt-5 leading-8 text-eflavMetinAcik">
            Görüntülemek istediğiniz sayfa kaldırılmış, taşınmış veya yanlış
            yazılmış olabilir.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/">
              Ana Sayfaya Dön
            </Button>

            <Button
              href="/iletisim"
              variant="outline"
            >
              Bizimle İletişime Geçin
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
