ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS sender_name VARCHAR(150) NULL AFTER amount,
  ADD COLUMN IF NOT EXISTS transfer_date DATE NULL AFTER sender_name,
  ADD INDEX IF NOT EXISTS idx_donations_transfer_match (transfer_date, amount);
