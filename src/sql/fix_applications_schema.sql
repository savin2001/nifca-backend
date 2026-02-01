-- First, let's check what status values exist
SELECT DISTINCT status FROM applications;

-- Step 1: Check if reference_number column exists, if not add it
-- (Run this only if the column doesn't exist - skip if error)
-- ALTER TABLE applications
-- ADD COLUMN reference_number VARCHAR(50) NULL AFTER client_id,
-- ADD UNIQUE KEY unique_reference (reference_number);

-- Step 2: Safely update the status enum
-- First, change to VARCHAR to preserve existing data
ALTER TABLE applications
MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending';

-- Update any non-standard status values if needed
-- (Check the SELECT DISTINCT output above first)
UPDATE applications SET status = 'pending' WHERE status NOT IN ('pending', 'submitted', 'approved', 'rejected', 'cancelled');

-- Now convert back to ENUM with all values
ALTER TABLE applications
MODIFY COLUMN status ENUM('pending', 'submitted', 'approved', 'rejected', 'cancelled') DEFAULT 'pending';

-- Step 3: Generate reference numbers for applications that don't have them
UPDATE applications
SET reference_number = CONCAT('APP-', YEAR(created_at), '-', LPAD(id, 5, '0'))
WHERE reference_number IS NULL OR reference_number = '';
