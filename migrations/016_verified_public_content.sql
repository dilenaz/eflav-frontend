ALTER TABLE activities
  ADD COLUMN source_label VARCHAR(150) NULL AFTER image_alt,
  ADD COLUMN source_url VARCHAR(500) NULL AFTER source_label;

UPDATE activities
SET status = 'archived'
WHERE slug IN ('egitim-ve-burs', 'sosyal-yardimlasma', 'kulturel-miras');

UPDATE events
SET status = 'archived'
WHERE slug IN ('olagan-mutevelli-heyeti-toplantisi', 'eflani-genclik-bulusmasi-ve-piknigi');

UPDATE gallery_albums
SET status = 'archived'
WHERE slug IN (
  'vakif-merkezi-acilis-toreni',
  'bursiyer-ogrencilerimizle-iftar-programi',
  'eflani-koy-yardimlari-dagitimi',
  'egitim-seminerleri-serisi-1',
  'mutevelli-heyeti-toplantisi',
  'geleneksel-eflani-senlikleri-standi'
);

INSERT INTO activities
  (title, slug, activity_date, icon, summary, content, image_url, image_alt, source_label, source_url, status, sort_order)
VALUES
  (
    'Vakıflar Haftası Programına Katılım',
    'vakiflar-haftasi-programina-katilim',
    '2025-05-08',
    '🏛️',
    'Vakıf Başkanımız Şeref Karakaya ve Vakıf Avukatımız Fatih Kocatürk, Ankara’da düzenlenen Vakıflar Haftası programına katıldı.',
    'Vakıf Başkanımız Şeref Karakaya ve Vakıf Avukatımız Fatih Kocatürk, 8 Mayıs 2025 tarihinde Cumhurbaşkanlığı Külliyesi Beştepe Kongre ve Kültür Merkezi’nde düzenlenen Vakıflar Haftası programına katıldı.

Programda vakıf kültürünün yaşatılması, kültürel mirasın korunması ve vakıf eserlerinin gelecek nesillere aktarılması konuları ele alındı.',
    '/images/activities/vakiflar-haftasi-programi.jpg',
    'Ankara’da düzenlenen 8 Mayıs 2025 Vakıflar Haftası program salonu',
    'Gebze Gazetesi',
    'https://www.gebzegazetesi.com/vakiflar-haftasi-dolayisi-ile-cumhurbaskanligi-kulliyesinde-duzenlenen-toplantidan-canli-yayin-makale%2C5899.html',
    'published',
    1
  ),
  (
    'Ankara Karabüklüler Vakfı Ziyareti',
    'ankara-karabukluler-vakfi-ziyareti',
    '2025-05-08',
    '🤝',
    'Vakıflar Haftası programının ardından Ankara Karabüklüler Vakfı ziyaret edilerek vakıf çalışmaları üzerine görüş alışverişi yapıldı.',
    'Vakıflar Haftası programının ardından Ankara Karabüklüler Vakfı ziyaret edildi. Vakıf Başkanı Şeref Karakaya ve Vakıf Avukatı Fatih Kocatürk’ün katıldığı ziyarette, vakıf faaliyetleri ve kültürel miras çalışmaları üzerine görüş alışverişi gerçekleştirildi.

Ziyaret kapsamında Ankara Karabüklüler Vakfı Başkanı Nizamettin Yüce ile bir belgesel söyleşisine de katılım sağlandı.',
    '/images/activities/vakiflar-haftasi-ankara.jpg',
    'Ankara Karabüklüler Vakfı ziyaretinde Şeref Karakaya, Fatih Kocatürk ve katılımcılar',
    'Facebook paylaşımı',
    'https://www.facebook.com/share/v/16VdxmrSmd/?mibextid=wwXIfr',
    'published',
    2
  )
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  activity_date = VALUES(activity_date),
  icon = VALUES(icon),
  summary = VALUES(summary),
  content = VALUES(content),
  image_url = VALUES(image_url),
  image_alt = VALUES(image_alt),
  source_label = VALUES(source_label),
  source_url = VALUES(source_url),
  status = VALUES(status),
  sort_order = VALUES(sort_order);

INSERT INTO gallery_albums
  (title, slug, summary, content, cover_image_url, cover_image_alt, status, published_at)
VALUES
  (
    'Vakıflar Haftası ve Ankara Ziyaretleri',
    'vakiflar-haftasi-ve-ankara-ziyaretleri',
    '8 Mayıs 2025 tarihli Vakıflar Haftası programı ve Ankara Karabüklüler Vakfı ziyaretinden görüntüler.',
    'Vakıf Başkanımız Şeref Karakaya ve Vakıf Avukatımız Fatih Kocatürk’ün katıldığı Vakıflar Haftası programı ile Ankara Karabüklüler Vakfı ziyaretinden doğrulanmış görüntüler.',
    '/images/activities/vakiflar-haftasi-programi.jpg',
    'Ankara’da düzenlenen Vakıflar Haftası program salonu',
    'published',
    '2025-05-08 12:00:00'
  )
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  summary = VALUES(summary),
  content = VALUES(content),
  cover_image_url = VALUES(cover_image_url),
  cover_image_alt = VALUES(cover_image_alt),
  status = VALUES(status),
  published_at = VALUES(published_at);

DELETE gallery_images
FROM gallery_images
INNER JOIN gallery_albums ON gallery_albums.id = gallery_images.album_id
WHERE gallery_albums.slug = 'vakiflar-haftasi-ve-ankara-ziyaretleri';

INSERT INTO gallery_images (album_id, image_url, image_alt, sort_order)
SELECT id, '/images/activities/vakiflar-haftasi-programi.jpg', 'Ankara’da düzenlenen Vakıflar Haftası program salonu', 1
FROM gallery_albums
WHERE slug = 'vakiflar-haftasi-ve-ankara-ziyaretleri';

INSERT INTO gallery_images (album_id, image_url, image_alt, sort_order)
SELECT id, '/images/activities/vakiflar-haftasi-ankara.jpg', 'Ankara Karabüklüler Vakfı ziyaretinde Şeref Karakaya, Fatih Kocatürk ve katılımcılar', 2
FROM gallery_albums
WHERE slug = 'vakiflar-haftasi-ve-ankara-ziyaretleri';

UPDATE content_pages
SET content = 'Eğitim, sosyal yardım, sağlık, kültürel mirasın korunması ve toplumsal kalkınma alanlarında faaliyet gösteriyoruz.

Hayırseverlerin emanetlerini şeffaf, hesap verebilir ve sürdürülebilir bir anlayışla ihtiyaç sahiplerine ulaştırıyoruz.

Kurumsal Mesaj
“İyilik, paylaşıldıkça büyüyen en değerli mirastır. Karabük Eflani Hayır Kervanı Vakfı olarak; insanı merkeze alan, güveni temel ilke edinen ve toplumsal dayanışmayı güçlendiren çalışmalarımızla, bugün olduğu gibi yarın da umut olmaya devam edeceğiz.”'
WHERE slug = 'ana-sayfa-hakkinda';
