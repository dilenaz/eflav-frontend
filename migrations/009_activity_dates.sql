ALTER TABLE activities ADD COLUMN activity_date DATE NULL AFTER slug;
UPDATE activities SET activity_date = DATE(created_at) WHERE activity_date IS NULL;
ALTER TABLE activities MODIFY activity_date DATE NOT NULL, ADD KEY idx_activities_archive (status, activity_date);
