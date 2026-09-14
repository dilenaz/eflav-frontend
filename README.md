# Karabük Eflani Hayır Kervanı Vakfı Web Platformu

Next.js 16 App Router, React 19, Tailwind CSS 4 ve MySQL tabanlı vakıf web ve yönetim platformu.

## Gereksinimler

- Node.js 24+
- MySQL 8+ veya uyumlu MariaDB
- UTF-8 (`utf8mb4`) veri tabanı

## Kurulum

Windows üzerinde PowerShell'i yönetici olarak açıp aşağıdaki tek komutla MySQL hizmetini başlatabilir, migration'ları uygulayabilir ve projeyi doğrulayabilirsiniz:

```powershell
npm run setup:local:windows
```

İlk yönetici hesabının da oluşturulması için komutu çalıştırmadan önce geçici `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL` ve `INITIAL_ADMIN_PASSWORD` ortam değerlerini tanımlayın. Kurulumdan sonra bu değerleri temizleyin.

1. `.env.example` dosyasını `.env.local` olarak kopyalayın ve gerçek değerleri girin.
2. Bağımlılıkları kurun: `npm ci`
3. Migration’ları uygulayın: `npm run db:migrate`
4. İlk kurulumda geçici `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL` ve en az 12 karakterli `INITIAL_ADMIN_PASSWORD` değerlerini tanımlayıp `npm run admin:create` çalıştırın. İşlemden sonra bu üç değeri ortamdan kaldırın.
5. Geliştirme sunucusunu başlatın: `npm run dev`

`JWT_SECRET` ile `DATA_ENCRYPTION_KEY` bağımsız ve güçlü olmalıdır. `DATA_ENCRYPTION_KEY` değiştirilirse daha önce şifrelenmiş kişisel veriler açılamaz; anahtar güvenli bir secret manager içinde yedeklenmelidir.

## Komutlar

- `npm run dev`: geliştirme sunucusu
- `npm run lint`: ESLint kontrolü
- `npm run build`: production build
- `npm run start`: production sunucusu
- `npm run db:migrate`: bekleyen veri tabanı migration’larını uygular
- `npm run db:backup`: sıkıştırılmış MySQL yedeği oluşturur ve saklama süresini uygular
- `npm run admin:create`: ilk yönetici hesabını güvenli parola özetiyle oluşturur

## Mimari

- `src/app`: sayfalar ve Route Handler API’leri
- `src/components`: ortak ve alan bileşenleri
- `src/lib/services`: SQL ve veri erişim katmanı
- `src/lib/validations`: ortak Zod şemaları
- `migrations`: sıralı, checksum ile korunan veri tabanı migration’ları

Yönetim panelindeki görsel yüklemeleri yerel dosya sisteminde `public/uploads` altında saklanır. Production’da bu yol `UPLOAD_DIR` ile belirtilen kalıcı dizine symlink edilmeli ve uygulama sürümü değişirken korunmalıdır. Birden fazla uygulama instance’ı veya serverless platform kullanılacaksa upload endpoint’i S3/R2 benzeri ortak obje depolamaya taşınmalıdır.

Server Component’ler kendi API’lerini HTTP üzerinden çağırmaz; servis katmanına doğrudan erişir. İstemci mutasyonları API Route Handler’ları üzerinden yapılır.

## Deployment kontrol listesi

Ayrıntılı şirket sunucusu kurulumu için `DEPLOYMENT.md` ve `deploy/` örneklerini kullanın.

- `npm ci`, `npm run db:migrate`, `npm run lint`, `npm run build`
- Node.js sunucusu veya tam Next.js desteği olan bir platform kullanın; uygulama MySQL ve Route Handler kullandığı için salt statik hosting uygun değildir.
- Production ortamında `DB_*`, `NEXT_PUBLIC_SITE_URL`, `JWT_SECRET` ve bağımsız `DATA_ENCRYPTION_KEY` değerlerini secret manager üzerinden tanımlayın.
- İlk admin hesabını `npm run admin:create` ile oluşturun ve geçici `INITIAL_ADMIN_*` değerlerini kaldırın.
- HTTPS zorunlu olmalıdır.
- MySQL günlük yedek ve geri yükleme testi yapılandırılmalıdır.
- İzleme sistemi `/api/health` rotasını düzenli kontrol etmelidir.
- Environment değerlerini repoya eklemeyin.
- Staging ortamında form, admin, CSP ve mobil navigasyon testlerini tamamlayın.

## Kişisel veri güvenliği

T.C. kimlik numaraları AES-256-GCM ile şifrelenir ve tekrar kontrolü için anahtarlı, geri döndürülemez parmak izi saklanır. Production erişimleri en az yetki prensibiyle sınırlandırılmalı ve KVKK saklama/imha politikası uygulanmalıdır.
