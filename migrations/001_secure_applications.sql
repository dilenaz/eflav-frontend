ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS email VARCHAR(190) NULL AFTER phone,
  ADD COLUMN IF NOT EXISTS tc_identity_hash CHAR(64) NULL AFTER tc_identity_number,
  ADD UNIQUE INDEX IF NOT EXISTS uq_applications_type_tc_hash (application_type, tc_identity_hash);
