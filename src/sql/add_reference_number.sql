-- Add reference_number column to applications table
ALTER TABLE applications
ADD COLUMN reference_number VARCHAR(50) NULL AFTER client_id,
ADD UNIQUE KEY unique_reference (reference_number);

-- Update existing applications with reference numbers (optional)
-- Format: APP-YYYY-XXXXX where XXXXX is zero-padded ID
UPDATE applications
SET reference_number = CONCAT('APP-', YEAR(created_at), '-', LPAD(id, 5, '0'))
WHERE reference_number IS NULL;
