CREATE TABLE IF NOT EXISTS gallery_albums (
 id INT UNSIGNED NOT NULL AUTO_INCREMENT,title VARCHAR(255) NOT NULL,slug VARCHAR(255) NOT NULL,
 summary VARCHAR(500) NOT NULL,content LONGTEXT NOT NULL,cover_image_url VARCHAR(500) NULL,cover_image_alt VARCHAR(255) NULL,
 status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',published_at DATETIME NULL,created_by INT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY(id),UNIQUE KEY uq_gallery_slug(slug),KEY idx_gallery_status_date(status,published_at),
 CONSTRAINT fk_gallery_admin FOREIGN KEY(created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS gallery_images (
 id INT UNSIGNED NOT NULL AUTO_INCREMENT,album_id INT UNSIGNED NOT NULL,image_url VARCHAR(500) NOT NULL,image_alt VARCHAR(255) NOT NULL,sort_order SMALLINT NOT NULL DEFAULT 0,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id),KEY idx_gallery_images_album(album_id,sort_order),CONSTRAINT fk_gallery_image_album FOREIGN KEY(album_id) REFERENCES gallery_albums(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT IGNORE INTO gallery_albums(title,slug,summary,content,cover_image_url,cover_image_alt,status,published_at) VALUES
('Vakıf Merkezi Açılış Töreni','vakif-merkezi-acilis-toreni','Vakıf merkezimizin açılış töreninden öne çıkan görüntüler.','Vakıf merkezimizin açılış töreni yöneticilerimiz, gönüllülerimiz ve hayırseverlerimizin katılımıyla gerçekleştirildi.',NULL,'Vakıf merkezi açılış töreni','published','2026-06-15'),
('Bursiyer Öğrencilerimizle İftar Programı','bursiyer-ogrencilerimizle-iftar-programi','Bursiyer öğrencilerimizle gerçekleştirdiğimiz dayanışma programı.','Bursiyer öğrencilerimizle eğitim çalışmaları ve gelecek hedefleri üzerine görüşmeler gerçekleştirildi.',NULL,'Bursiyer öğrencilerle iftar programı','published','2026-03-22'),
('Eflani Köy Yardımları Dağıtımı','eflani-koy-yardimlari-dagitimi','İhtiyaç sahibi ailelere ulaştırılan yardımlardan görüntüler.','Eflani köylerinde yaşayan ihtiyaç sahibi ailelerimize temel ihtiyaç malzemeleri ulaştırıldı.',NULL,'Eflani köy yardımları','published','2026-02-10'),
('Eğitim Seminerleri Serisi','egitim-seminerleri-serisi-1','Öğrenciler ve gençler için düzenlenen eğitim semineri.','Gençlerin akademik ve mesleki gelişimlerine katkı sağlayan eğitim programı tamamlandı.',NULL,'Eğitim semineri','published','2026-01-25'),
('Mütevelli Heyeti Toplantısı','mutevelli-heyeti-toplantisi','Yeni dönem projelerinin değerlendirildiği toplantı.','Faaliyetler, mali durum ve yeni dönem sosyal yardım programları değerlendirildi.',NULL,'Mütevelli heyeti toplantısı','published','2025-12-18'),
('Geleneksel Eflani Şenlikleri Standı','geleneksel-eflani-senlikleri-standi','Geleneksel Eflani Şenlikleri vakıf standı.','Standımızda vakfımızın faaliyetleri tanıtıldı ve ziyaretçilere bilgi verildi.',NULL,'Eflani Şenlikleri vakıf standı','published','2025-08-03');
