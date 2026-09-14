CREATE TABLE IF NOT EXISTS admins (
  id INT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS applications (
  id INT NOT NULL AUTO_INCREMENT,
  application_type ENUM('burs','yardim') NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  tc_identity_number VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  settlement_type ENUM('eflani_merkez','eflani_koyu','eflani_mahallesi') NOT NULL,
  settlement_name VARCHAR(150) NOT NULL,
  university_name VARCHAR(200) NULL,
  department_name VARCHAR(200) NULL,
  request_detail TEXT NULL,
  document_path VARCHAR(500) NULL,
  kvkk_approved TINYINT(1) NOT NULL DEFAULT 0,
  application_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS campaigns (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  campaign_type ENUM('genel_destek','egitim_bursu','kis_destegi','koy_okullari','diger') NOT NULL,
  target_amount DECIMAL(12,2) NULL,
  collected_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('active','completed','passive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS donations (
  id INT NOT NULL AUTO_INCREMENT,
  campaign_id INT NULL,
  donation_type VARCHAR(150) NOT NULL,
  payment_period ENUM('tek_seferlik','aylik_duzenli') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  dedication_name VARCHAR(150) NULL,
  is_anonymous TINYINT(1) NOT NULL DEFAULT 0,
  payment_status ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  payment_reference VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_donation_campaign (campaign_id),
  CONSTRAINT fk_donation_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payment_transactions (
  id INT NOT NULL AUTO_INCREMENT,
  donation_id INT NOT NULL,
  provider VARCHAR(100) NULL,
  transaction_reference VARCHAR(255) NULL,
  amount DECIMAL(12,2) NOT NULL,
  status ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  provider_response TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_transaction_donation (donation_id),
  CONSTRAINT fk_transaction_donation FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500) NULL,
  image_alt VARCHAR(255) NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_news_slug (slug),
  KEY idx_news_status (status), KEY idx_news_published (published_at),
  KEY idx_news_featured (is_featured), KEY idx_news_admin (created_by),
  CONSTRAINT fk_news_admin FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
