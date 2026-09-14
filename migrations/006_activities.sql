CREATE TABLE IF NOT EXISTS activities (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL,
  icon VARCHAR(32) NULL, summary VARCHAR(500) NOT NULL, content LONGTEXT NOT NULL,
  image_url VARCHAR(500) NULL, image_alt VARCHAR(255) NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  sort_order SMALLINT NOT NULL DEFAULT 0, created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id), UNIQUE KEY uq_activities_slug(slug),
  KEY idx_activities_status_sort(status,sort_order),
  CONSTRAINT fk_activities_admin FOREIGN KEY(created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO activities (title,slug,icon,summary,content,image_url,image_alt,status,sort_order) VALUES
('Eğitim ve Burs','egitim-ve-burs','🎓','Başarılı ve ihtiyaç sahibi öğrencilerimize eğitim hayatları boyunca burs ve eğitim desteği sağlıyoruz.','Maddi imkânları kısıtlı ancak başarılı öğrencilerin eğitim hayatlarını destekliyor; burs, eğitim materyali ve sosyal gelişim programları yürütüyoruz.',NULL,'Eğitim ve burs faaliyetleri','published',1),
('Sosyal Yardımlaşma','sosyal-yardimlasma','🤝','Eflani’de ihtiyaç sahibi ailelere gıda, yakacak ve temel yaşam desteği sağlıyoruz.','Gıda, yakacak, kıyafet ve acil ihtiyaç desteklerini şeffaflık ve adalet ilkeleri doğrultusunda ihtiyaç sahiplerine ulaştırıyoruz.',NULL,'Sosyal yardımlaşma faaliyetleri','published',2),
('Kültürel Miras','kulturel-miras','🏛️','Eflani’nin kültürel değerlerini koruyarak gelecek nesillere aktarıyoruz.','Eflani’nin tarihî yapıları, gelenekleri ve yerel değerlerinin korunması için etkinlik ve tanıtım çalışmaları yürütüyoruz.',NULL,'Kültürel miras faaliyetleri','published',3);
