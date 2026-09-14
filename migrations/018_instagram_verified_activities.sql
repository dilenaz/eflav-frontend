INSERT INTO activities
  (title, slug, activity_date, icon, summary, content, image_url, image_alt, source_label, source_url, status, sort_order)
VALUES
  (
    'Karabük Üniversitesi İstişare Toplantısına Katılım',
    'karabuk-universitesi-istisare-toplantisi',
    '2025-01-17',
    '🏛️',
    'Vakfımız, Karabük Üniversitesi’nde gerçekleştirilen istişare toplantısına katıldı.',
    'Karabük Eflani Hayır Kervanı Vakfı, 17 Ocak 2025 tarihinde Karabük Üniversitesi’nde gerçekleştirilen istişare toplantısına katıldı.',
    '/images/activities/karabuk-universitesi-istisare-toplantisi.jpg',
    'Karabük Üniversitesi istişare toplantısında Vakıf Başkanı Şeref Karakaya',
    'Instagram paylaşımı',
    'https://www.instagram.com/karabukeflanivakfi/reel/DE7Z8ZtNw_m/',
    'published',
    3
  ),
  (
    'Kocaeli Derneklerinden Vakfımıza Ziyaret',
    'kocaeli-derneklerinden-vakfimiza-ziyaret',
    '2025-01-24',
    '🤝',
    'Kocaeli Karabüklüler Derneği ile Karabük İli Sosyal Yardımlaşma Derneği yönetimleri vakfımızı ziyaret etti.',
    'Kocaeli Karabüklüler Derneği ve Karabük İli Sosyal Yardımlaşma Derneği yönetimleri, 24 Ocak 2025 tarihinde Karabük Eflani Hayır Kervanı Vakfını ziyaret etti. Katılım sağlayan tüm misafirlere teşekkür ederiz.',
    '/images/activities/kocaeli-dernekleri-vakif-ziyareti.jpg',
    'Kocaeli Karabüklüler Derneği ve Karabük İli Sosyal Yardımlaşma Derneği yönetimlerinin vakıf ziyareti',
    'Instagram paylaşımı',
    'https://www.instagram.com/karabukeflanivakfi/p/DFOJb0Ptvjc/',
    'published',
    4
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
    'Ocak 2025 Kurumsal Görüşmeleri',
    'ocak-2025-kurumsal-gorusmeleri',
    'Karabük Üniversitesi istişare toplantısı ile Kocaeli’deki hemşehri derneklerinin vakıf ziyaretinden görüntüler.',
    '17 Ocak 2025 tarihli Karabük Üniversitesi istişare toplantısı ve 24 Ocak 2025 tarihli dernekler ziyareti, vakfın resmî Instagram hesabındaki paylaşımlar üzerinden doğrulanmıştır.',
    '/images/activities/kocaeli-dernekleri-vakif-ziyareti.jpg',
    'Kocaeli’deki hemşehri derneklerinin Karabük Eflani Hayır Kervanı Vakfı ziyareti',
    'published',
    '2025-01-24 12:00:00'
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
WHERE gallery_albums.slug = 'ocak-2025-kurumsal-gorusmeleri';

INSERT INTO gallery_images (album_id, image_url, image_alt, sort_order)
SELECT id, '/images/activities/karabuk-universitesi-istisare-toplantisi.jpg', 'Karabük Üniversitesi istişare toplantısında Vakıf Başkanı Şeref Karakaya', 1
FROM gallery_albums
WHERE slug = 'ocak-2025-kurumsal-gorusmeleri';

INSERT INTO gallery_images (album_id, image_url, image_alt, sort_order)
SELECT id, '/images/activities/kocaeli-dernekleri-vakif-ziyareti.jpg', 'Kocaeli’deki hemşehri derneklerinin Karabük Eflani Hayır Kervanı Vakfı ziyareti', 2
FROM gallery_albums
WHERE slug = 'ocak-2025-kurumsal-gorusmeleri';
