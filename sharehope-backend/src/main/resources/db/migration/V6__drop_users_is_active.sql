-- is_active is superseded by the status column (INVITED/ACTIVE/DISABLED).
ALTER TABLE users DROP COLUMN is_active;
