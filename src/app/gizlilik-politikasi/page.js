import Link from 'next/link';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Gizlilik Politikası',
  description: 'Karabük Eflani Hayır Kervanı Vakfı web sitesinin gizlilik, güvenlik ve çerez uygulamaları.',
  alternates: { canonical: '/gizlilik-politikasi' },
};

const sections = [
  ['1. Kapsam', 'Bu politika, Karabük Eflani Hayır Kervanı Vakfı web sitesini ziyaret ettiğinizde veya sitedeki başvuru, iletişim ve bağış bildirimi hizmetlerini kullandığınızda bilgilerin nasıl işlendiğini açıklar. Kişisel verilerin işlenmesine ilişkin ayrıntılı hukuki bilgilendirme KVKK Aydınlatma Metni’nde yer alır.'],
  ['2. Site üzerinden sağladığınız bilgiler', 'Başvuru formlarında kimlik, iletişim, yerleşim, eğitim ve talep bilgileri; iletişim formunda ad-soyad, e-posta, konu ve mesaj; bağış bildirimi formunda havale gönderen adı, transfer tarihi, bağış türü, dönem, tutar, isteğe bağlı ithaf adı ve anonimlik tercihi alınır. Ödeme kartı veya internet bankacılığı parolası alınmaz; site üzerinden kartlı ödeme yapılmaz.'],
  ['3. Teknik ve güvenlik verileri', 'Kötüye kullanımı önlemek, oturum güvenliğini sağlamak ve sistem hatalarını araştırmak amacıyla IP adresi, istek zamanı, istenen sayfa, oturum ve yönetim işlemi kayıtları işlenebilir. Herkese açık formlarda Cloudflare Turnstile robot doğrulaması kullanılır.'],
  ['4. Çerezler', 'Site, yönetici oturumunun güvenli biçimde sürdürülmesi için yalnızca kesinlikle gerekli bir oturum çerezi kullanır. Bu çerez HttpOnly, Secure ve SameSite güvenlik nitelikleriyle oluşturulur, pazarlama amacı taşımaz ve oturum süresi sonunda geçerliliğini yitirir. Şu anda reklam, davranışsal pazarlama veya ziyaretçi analitiği çerezi kullanılmamaktadır. İleride zorunlu olmayan çerezler eklenirse bunlar açık rızanız alınmadan çalıştırılmaz ve politika buna göre güncellenir.'],
  ['5. Üçüncü taraf hizmetleri', 'Robot doğrulaması için Cloudflare Turnstile kullanılır. Turnstile, isteğin gerçek bir kullanıcıdan gelip gelmediğini değerlendirmek için IP adresi ve cihaz/bağlantı bilgilerini işleyebilir. Sitedeki harici bağlantılar açıldığında ilgili üçüncü tarafın kendi gizlilik koşulları geçerlidir.'],
  ['6. Paylaşım ve erişim', 'Bilgilere yalnızca görevleri için gerekli olan yetkili Vakıf çalışanları ve yöneticileri erişir. Teknik hizmet sağlayıcılar verileri yalnızca hizmetin sunulması için gerekli ölçüde işler. Kanuni zorunluluk hâlinde yetkili kamu kurumları ve adli mercilerle paylaşım yapılabilir. Kişisel veriler satılmaz ve reklam amacıyla üçüncü kişilere verilmez.'],
  ['7. Saklama ve silme', 'Kayıtlar işleme amacı ve ilgili yasal yükümlülükler devam ettiği sürece saklanır. Süre belirlenirken mali ve hukuki yükümlülükler, zamanaşımı süreleri ve olası uyuşmazlıklar dikkate alınır. Süresi dolan veriler güvenli biçimde silinir, yok edilir veya anonim hâle getirilir; yedeklerdeki kopyalar olağan yedek döngüsü içinde kullanım dışı bırakılır.'],
  ['8. Güvenlik', 'Site HTTPS üzerinden sunulur. Kişisel verilere erişim yetkiyle sınırlandırılır; T.C. kimlik numaraları veritabanında şifrelenir; yönetici oturumları güvenli çerezlerle korunur; istek sınırlandırma, robot doğrulama, denetim kaydı, yedekleme ve güvenlik başlıkları uygulanır. İnternet üzerinden hiçbir aktarım için mutlak güvenlik garantisi verilemese de riske uygun teknik ve idari tedbirler düzenli olarak gözden geçirilir.'],
  ['9. Haklar ve iletişim', 'Kişisel verilerinize ilişkin erişim, düzeltme, silme ve diğer KVKK haklarınızı kullanmak için KVKK Aydınlatma Metni’ndeki yöntemlerle başvurabilirsiniz. Gizlilik sorularınızı internet sitesindeki iletişim formu üzerinden iletebilirsiniz.'],
  ['10. Değişiklikler', 'Mevzuat veya site işlevleri değiştiğinde bu politika güncellenebilir. Güncel sürüm, yürürlük tarihiyle birlikte bu sayfada yayımlanır. Önemli değişikliklerde uygun kanallardan ayrıca bilgilendirme yapılır.'],
];

export default function PrivacyPolicyPage() {
  return <main className="min-h-screen bg-eflavKrem py-16"><Container>
    <article className="mx-auto max-w-4xl rounded-3xl border border-eflavSinir bg-white p-8 shadow-sm md:p-12">
      <header className="border-b border-eflavSinir pb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-eflavAltin">Yasal Bilgilendirme</p>
        <h1 className="mt-3 text-3xl font-black text-eflavAntrasit md:text-5xl">Gizlilik Politikası</h1>
        <p className="mt-4 leading-7 text-eflavMetinAcik">Web sitesinde hangi bilgilerin neden işlendiğini, kullanılan güvenlik önlemlerini ve çerezleri açıklar.</p>
        <p className="mt-3 text-sm text-eflavMetinAcik">Yürürlük ve son güncelleme: 17 Temmuz 2026</p>
      </header>
      <div className="mt-10 space-y-10">
        {sections.map(([title, content]) => <section key={title}>
          <h2 className="text-2xl font-bold text-eflavAntrasit">{title}</h2>
          <p className="mt-4 leading-8 text-eflavMetin">{content}</p>
        </section>)}
      </div>
      <footer className="mt-12 border-t border-eflavSinir pt-6 text-sm leading-7 text-eflavMetinAcik">
        Kişisel veri işleme faaliyetleri ve başvuru hakları için <Link href="/kvkk" className="font-semibold text-eflavBordo underline">KVKK Aydınlatma Metni</Link>’ni inceleyin.
      </footer>
    </article>
  </Container></main>;
}
