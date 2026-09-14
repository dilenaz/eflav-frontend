# Production kurulumu

Bu uygulama Node.js 24+, MySQL 8+, kalıcı disk ve HTTPS reverse proxy gerektirir. Salt statik hosting uygun değildir.

## Sunucu dizinleri

```text
/opt/eflav/current          uygulama sürümü
/var/lib/eflav/uploads      kalıcı görseller
/var/backups/eflav          veritabanı yedekleri
/etc/eflav/eflav.env        production secret değerleri
```

`eflav` servis kullanıcısına uygulama dizininde okuma, `.next` ile upload/yedek dizinlerinde yazma yetkisi verin. `UPLOAD_DIR=/var/lib/eflav/uploads` olmalı. Uygulamanın `public/uploads` yolunu kalıcı dizine bağlayın ve Nginx `/uploads/` yolunu aynı dizine `alias` etsin:

```bash
ln -s /var/lib/eflav/uploads /opt/eflav/current/public/uploads
```

Yeni release kurulurken bu bağlantı yeniden oluşturulmalı; `/var/lib/eflav/uploads` silinmemelidir.

## İlk kurulum

1. Node.js 24+, MySQL 8+, Nginx ve `mysqldump` kurun.
2. Kodu `/opt/eflav/current` altına yerleştirin ve `npm ci` çalıştırın.
3. `.env.example` değerlerini `/etc/eflav/eflav.env` içinde gerçek production değerleriyle tanımlayın.
4. `npm run check:production` çalıştırın; hata varken devam etmeyin.
5. `npm run db:migrate`, ardından ilk kurulumda `npm run admin:create` çalıştırın.
6. `npm run lint && npm test && npm run build` çalıştırın.
7. `deploy/eflav.service.example` dosyasını alan adlarına/dizinlere göre düzenleyip systemd servisi olarak kurun.
8. `deploy/nginx.conf.example` dosyasını gerçek alan adı ve TLS sertifika yollarıyla kurun.
9. `/api/health` yanıtının `200` ve `database: ok` verdiğini doğrulayın.

`check:production` yalnızca değişkenlerin varlığını değil; HTTPS alan adını,
secret uzunluklarını, upload dizini izinlerini ve MySQL bağlantısını da doğrular.
Systemd servisi de her başlangıçta aynı kontrolü ve bekleyen veritabanı migrationlarını çalıştırır.

## Her yeni sürüm

1. Veritabanı ve upload dizini yedeği alın.
2. Yeni kodda `npm ci`, `npm run db:migrate`, `npm run lint`, `npm test`, `npm run build` çalıştırın.
3. Servisi yeniden başlatıp `/api/health` ve temel kullanıcı akışlarını kontrol edin.
4. Önceki uygulama sürümünü geri dönüş için saklayın; migration dosyalarını sonradan değiştirmeyin.

## Otomatik yedek

`BACKUP_DIR=/var/backups/eflav` ile `npm run db:backup` komutunu günlük zamanlayın. Ayrıca `/var/lib/eflav/uploads` dizinini sunucudan farklı bir konuma yedekleyin. Düzenli geri yükleme testi yapılmadan yedekleme tamamlanmış sayılmaz.

## Canlıya geçiş kontrolü

- Gerçek alan adı ve HTTPS
- Production secret manager/environment değerleri
- Turnstile anahtarları
- Yönetici bildirim webhook’u veya e-posta sistemi
- Uptime ve hata izleme
- KVKK metinlerinin hukuki onayı
- Gerçek ödeme alınacaksa ödeme sağlayıcısı ve webhook entegrasyonu
