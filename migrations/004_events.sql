CREATE TABLE IF NOT EXISTS events (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NULL,
  location VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NULL,
  image_alt VARCHAR(255) NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_events_slug (slug),
  KEY idx_events_status_date (status, event_date),
  CONSTRAINT fk_events_admin FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO events
  (title, slug, summary, content, event_date, event_time, location, image_url, image_alt, status)
VALUES
  ('Olağan Mütevelli Heyeti Toplantısı', 'olagan-mutevelli-heyeti-toplantisi',
   'Yıllık faaliyet raporlarının değerlendirileceği ve yeni dönem projelerinin planlanacağı mütevelli heyeti toplantımız gerçekleştirilecektir.',
   'Vakfımızın yıllık faaliyet raporları değerlendirilecek, mali durum görüşülecek ve gelecek dönem sosyal yardım, eğitim ve kültürel projeleri hakkında kararlar alınacaktır.',
   '2026-08-15', '14:00:00', 'Vakıf Genel Merkezi Seminer Salonu', NULL, 'Mütevelli heyeti toplantısı', 'published'),
  ('Eflani Gençlik Buluşması ve Pikniği', 'eflani-genclik-bulusmasi-ve-piknigi',
   'Üniversite bursiyerlerimiz ve Eflanili gençlerimizle tanışma ve dayanışma etkinliği düzenliyoruz.',
   'Bursiyer öğrencilerimiz, gönüllülerimiz ve Eflanili gençlerimiz tanışma etkinlikleri, takım oyunları ve kariyer söyleşileri için bir araya gelecektir.',
   '2026-08-23', '10:00:00', 'Eflani Ortaköy Mesire Alanı', NULL, 'Eflani gençlik buluşması', 'published');
