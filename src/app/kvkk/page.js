import Link from 'next/link';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'Karabük Eflani Hayır Kervanı Vakfı kişisel verilerin işlenmesine ilişkin aydınlatma metni.',
  alternates: { canonical: '/kvkk' },
};

const sections = [
  {
    title: '1. Veri sorumlusu',
    paragraphs: [
      '6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında veri sorumlusu Karabük Eflani Hayır Kervanı Vakfı’dır (“Vakıf”). Vakfa Pelitli Mahallesi, Mollafenari Caddesi No:86, Gebze / Kocaeli adresinden veya internet sitesindeki iletişim formu üzerinden ulaşabilirsiniz.',
    ],
  },
  {
    title: '2. İşlenen kişisel veriler',
    paragraphs: [
      'Sosyal yardım başvurularında ad-soyad, T.C. kimlik numarası, telefon, başvuru türü, yerleşim bilgisi ve talep açıklaması işlenir.',
      'İletişim formunda ad-soyad, e-posta, konu ve mesaj; bağış bildiriminde havale gönderen adı, transfer tarihi, bağış türü, ödeme dönemi, tutar, isteğe bağlı ithaf adı ve anonimlik tercihi işlenir. Site ve yönetim paneli güvenliği için IP adresinden üretilen tek yönlü güvenlik kayıtları, işlem zamanı, oturum ve denetim kayıtları da işlenebilir.',
      'Formlarda sağlık, biyometrik/genetik veri, dinî veya siyasi görüş, ceza mahkûmiyeti gibi özel nitelikli kişisel veriler talep edilmez. Başvurunuzun değerlendirilmesi için zorunlu olmadıkça bu bilgileri serbest metin alanlarına yazmayınız.',
    ],
  },
  {
    title: '3. İşleme amaçları ve hukuki sebepler',
    paragraphs: [
      'Veriler; sosyal yardım başvurularını almak, mükerrer başvuruları önlemek, başvuruyu değerlendirmek ve sonuçlandırmak; bağış bildirimlerini banka hareketleriyle eşleştirmek; iletişim taleplerini yanıtlamak; Vakfın mali ve idari kayıtlarını tutmak; bilgi güvenliğini sağlamak ve uyuşmazlıklarda hakları korumak amaçlarıyla işlenir.',
      'Bu işlemler KVKK’nın 5. maddesindeki bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olma, veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi, bir hakkın tesisi/kullanılması/korunması ve ilgili kişinin temel haklarına zarar vermemek kaydıyla Vakfın meşru menfaati hukuki sebeplerine dayanır. Açık rıza gereken ayrı bir faaliyet olursa, aydınlatmadan ayrı ve özgür iradeye dayalı bir onay alınır.',
    ],
  },
  {
    title: '4. Toplama yöntemi',
    paragraphs: [
      'Kişisel veriler internet sitesi formları ve sizin Vakıfla kurduğunuz elektronik, telefonla veya yazılı iletişim aracılığıyla otomatik ya da kısmen otomatik yöntemlerle toplanır. Güvenlik kayıtları, siteye ve yönetim paneline yapılan istekler sırasında otomatik olarak oluşturulur.',
    ],
  },
  {
    title: '5. Aktarım ve yurt dışı aktarımı',
    paragraphs: [
      'Veriler, yalnızca amaçla sınırlı ve gerekli olduğu ölçüde; barındırma, yedekleme ve teknik destek sağlayıcılarına, mali müşavir ve hukuk danışmanlarına, bankalara ve kanunen yetkili kamu kurumları ile adli mercilere aktarılabilir.',
      'Robot doğrulaması Cloudflare Turnstile aracılığıyla sağlanır. Bu hizmet sırasında IP adresi ve teknik bağlantı verileri Cloudflare tarafından işlenebilir. Yurt dışına aktarım gereken hâllerde KVKK’nın 9. maddesindeki güncel aktarım şartları ve uygun güvenceler uygulanır.',
    ],
  },
  {
    title: '6. Saklama ve güvenlik',
    paragraphs: [
      'Veriler, ilgili sürecin gerektirdiği süre ile Vakfın tabi olduğu mali, vergisel ve hukuki saklama/zamanaşımı süreleri boyunca muhafaza edilir; süre sonunda silinir, yok edilir veya anonim hâle getirilir. Saklama süresi belirlenirken işleme amacı, yasal zorunluluklar ve olası uyuşmazlık süreleri dikkate alınır.',
      'T.C. kimlik numaraları uygulama veritabanında güçlü şifreleme ile korunur; erişimler yetkiyle sınırlandırılır. Aktarım güvenliği, erişim kontrolleri, kayıt tutma, yedekleme ve güncelleme tedbirleri uygulanır.',
    ],
  },
  {
    title: '7. KVKK’nın 11. maddesindeki haklarınız',
    paragraphs: [
      'Vakıftan kişisel verilerinizin işlenip işlenmediğini öğrenme; işlenmişse bilgi isteme; işleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme; yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme; eksik veya yanlış işlenmişse düzeltilmesini isteme; şartları oluşmuşsa silinmesini veya yok edilmesini ve bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme; münhasıran otomatik sistemlerle analiz sonucu aleyhinize bir sonuca itiraz etme ve kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme haklarına sahipsiniz.',
    ],
  },
  {
    title: '8. Başvuru yöntemi',
    paragraphs: [
      'Talebinizi kimliğinizi doğrulamaya elverişli bilgi ve belgelerle birlikte Vakfa yazılı olarak veya internet sitesindeki iletişim formunda “KVKK İlgili Kişi Başvurusu” konusunu belirterek iletebilirsiniz. Başvuruda ad-soyad, iletişim bilgisi, talebin konusu ve varsa destekleyici belgeler bulunmalıdır.',
      'Başvurular talebin niteliğine göre en kısa sürede ve en geç 30 gün içinde ücretsiz sonuçlandırılır. İşlemin ayrıca maliyet gerektirmesi hâlinde mevzuattaki tarife uygulanabilir.',
    ],
  },
];

export default function KvkkPage() {
  return <main className="min-h-screen bg-eflavKrem py-16"><Container>
    <article className="mx-auto max-w-4xl rounded-3xl border border-eflavSinir bg-white p-8 shadow-sm md:p-12">
      <header className="border-b border-eflavSinir pb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-eflavAltin">Yasal Bilgilendirme</p>
        <h1 className="mt-3 text-3xl font-black text-eflavAntrasit md:text-5xl">KVKK Aydınlatma Metni</h1>
        <p className="mt-4 leading-7 text-eflavMetinAcik">Bu metin, kişisel verilerinizin hangi kapsamda işlendiğini açıklar. Metni okumak bir açık rıza beyanı değildir.</p>
        <p className="mt-3 text-sm text-eflavMetinAcik">Yürürlük ve son güncelleme: 17 Temmuz 2026</p>
      </header>
      <div className="mt-10 space-y-10 text-eflavMetin">
        {sections.map((section) => <section key={section.title}>
          <h2 className="text-2xl font-bold text-eflavAntrasit">{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8">{paragraph}</p>)}
        </section>)}
      </div>
      <footer className="mt-12 border-t border-eflavSinir pt-6 text-sm leading-7 text-eflavMetinAcik">
        Web sitesi kullanımına ilişkin ayrıntılar için <Link href="/gizlilik-politikasi" className="font-semibold text-eflavBordo underline">Gizlilik Politikası</Link>’nı inceleyebilirsiniz.
      </footer>
    </article>
  </Container></main>;
}
