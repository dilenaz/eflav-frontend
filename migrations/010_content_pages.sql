CREATE TABLE IF NOT EXISTS content_pages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  eyebrow VARCHAR(100) NULL,
  summary VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_content_pages_slug (slug),
  CONSTRAINT fk_content_pages_admin FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO content_pages (slug,title,eyebrow,summary,content) VALUES
('amac','Vakfımızın Amacı','Kurumsal','Eflani için kalıcı dayanışma, yardımlaşma ve kalkınma köprüsü oluşturuyoruz.','Karabük Eflani Hayır Vakfı, Eflani ilçemiz, köyleri ve mahalleleri arasında kalıcı bir dayanışma, yardımlaşma ve kalkınma köprüsü oluşturmak amacıyla kurulmuştur.\n\nVakfımızın temel amacı; maddi imkânsızlıklar nedeniyle eğitim hayatına devam etmekte zorlanan başarılı yükseköğrenim öğrencilerimize kesintisiz burs desteği sağlamak, ilçemizdeki ihtiyaç sahibi ailelerin temel yaşam gereksinimlerini karşılamak ve Eflani''nin tarihsel, kültürel ve sosyal mirasını koruyarak gelecek nesillere aktarmaktır.\n\nBu doğrultuda toplumsal birlikteliği pekiştirecek sosyal projeler üretir, hayırseverlerimiz ile ihtiyaç sahiplerini şeffaf, güvenilir ve sürdürülebilir bir kurumsal çatı altında bir araya getiririz.'),
('misyon-vizyon','Misyon & Vizyon','Kurumsal','Şeffaf, adil ve sürdürülebilir bir dayanışma modeli.','Misyonumuz\nEflani ve çevresindeki ihtiyaç sahibi vatandaşlarımıza, özellikle geleceğimizin teminatı olan öğrencilerimize şeffaf, adil ve sürdürülebilir destek mekanizmaları sunmak; toplumsal yardımlaşma bilincini yaygınlaştırmak ve bölgemizin sosyo-kültürel kalkınmasına öncülük etmektir.\n\nVizyonumuz\nGeliştirdiği şeffaf yönetim modelleri ve toplumsal etki odaklı projeleriyle Karabük ve Eflani''yi en iyi şekilde temsil eden, modern vakıfçılığın imkânlarını kullanarak sağladığı faydayı büyüten saygın bir sivil toplum kuruluşu olmaktır.'),
('tarihce','Tarihçemiz','Kurumsal','Eflani için atılan köklü iyilik adımları.','Karabük Eflani Hayır Vakfı, Eflani ilçemizin sosyal, kültürel ve ekonomik açıdan kalkınmasını desteklemek ve hemşehrilerimiz arasındaki yardımlaşma bağlarını güçlendirmek amacıyla kurulmuştur.\n\nGönüllülük ve şeffaflık esasıyla filizlenen bu hareket, eğitim bursları ve sosyal yardımlarla büyüyerek kurumsal bir çatıya kavuşmuştur. Vakfımız kültürel mirasın korunması ve toplumsal projelerin hayata geçirilmesi için çalışmalarını sürdürmektedir.'),
('yonetim-kurulu','Yönetim Kurulu','Vakıf Organları','Vakfımızın stratejik kararlarını alan ve projelerini yöneten yönetim kadrosu.','Yönetim Kurulu Başkanı — Vakıf Başkanı\n\nYönetim Kurulu Başkan Vekili — Başkan Yardımcısı\n\nGenel Sekreter — Vakıf Sekreteri\n\nSayman Üye — Mali İşler Sorumlusu\n\nGüncel isim, görev ve görev süresi bilgileri yönetim panelinden yayımlanmalıdır.'),
('tuzuk','Vakıf Tüzüğü','Kurumsal','Vakfın kuruluş amaçları ve temel hükümleri.','MADDE 1: VAKFIN ADI\nVakfın adı “Karabük Eflani Hayır Vakfı”dır.\n\nMADDE 2: VAKFIN MERKEZİ\nVakfın merkezi Karabük olup ilgili mevzuat çerçevesinde şube ve temsilcilik açabilir.\n\nMADDE 3: VAKFIN AMACI\nİhtiyaç sahibi vatandaşlara eğitim, sağlık, sosyal yardımlaşma ve kültürel alanlarda destek sağlamaktır.\n\nMADDE 4: FAALİYET ALANLARI\nBaşarılı ve ihtiyaç sahibi öğrencilere burs sağlamak; sosyal yardımlaşma organizasyonları düzenlemek; kültürel mirası koruyucu faaliyetlerde bulunmaktır.'),
('seref-karakaya','Şeref Karakaya Kimdir?','Hakkımızda','Şeref Karakaya’nın biyografisi ve vakfın kuruluş sürecindeki rolü.','Şeref Karakaya’nın doğrulanmış biyografisi ve Karabük Eflani Hayır Vakfının kuruluş sürecindeki rolü bu alanda yayımlanacaktır.');
