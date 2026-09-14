CREATE TABLE IF NOT EXISTS admin_login_attempts (
  identifier_hash CHAR(64) NOT NULL,
  failed_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  first_failed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  blocked_until DATETIME NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (identifier_hash),
  INDEX idx_login_attempts_blocked (blocked_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
