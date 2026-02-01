-- Add 'submitted' status to applications table
ALTER TABLE applications
MODIFY COLUMN status ENUM('pending', 'submitted', 'approved', 'rejected', 'cancelled') DEFAULT 'pending';

-- Optional: Update any pending applications to submitted if needed
-- UPDATE applications SET status = 'submitted' WHERE status = 'pending';
