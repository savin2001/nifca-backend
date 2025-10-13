-- Social Media Integration Migration
-- Add social media posting fields to content tables
-- Run this migration to enable social media posting features

-- Add social media fields to news table
ALTER TABLE news
ADD COLUMN IF NOT EXISTS post_to_twitter BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS post_to_linkedin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS twitter_post_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS linkedin_post_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS twitter_post_url TEXT NULL,
ADD COLUMN IF NOT EXISTS linkedin_post_url TEXT NULL,
ADD COLUMN IF NOT EXISTS social_media_posted_at TIMESTAMP NULL;

-- Add social media fields to press_releases table
ALTER TABLE press_releases
ADD COLUMN IF NOT EXISTS post_to_twitter BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS post_to_linkedin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS twitter_post_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS linkedin_post_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS twitter_post_url TEXT NULL,
ADD COLUMN IF NOT EXISTS linkedin_post_url TEXT NULL,
ADD COLUMN IF NOT EXISTS social_media_posted_at TIMESTAMP NULL;

-- Add social media fields to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS post_to_twitter BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS post_to_linkedin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS twitter_post_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS linkedin_post_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS twitter_post_url TEXT NULL,
ADD COLUMN IF NOT EXISTS linkedin_post_url TEXT NULL,
ADD COLUMN IF NOT EXISTS social_media_posted_at TIMESTAMP NULL;

-- Optional: Create social media posts log table for tracking
CREATE TABLE IF NOT EXISTS social_media_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_type ENUM('news', 'press_release', 'event') NOT NULL,
  content_id INT NOT NULL,
  platform ENUM('twitter', 'linkedin') NOT NULL,
  post_id VARCHAR(255) NULL,
  post_url TEXT NULL,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT NULL,
  posted_by INT NOT NULL,
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_content (content_type, content_id),
  INDEX idx_platform (platform),
  INDEX idx_posted_at (posted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments for documentation
ALTER TABLE news MODIFY COLUMN post_to_twitter BOOLEAN DEFAULT FALSE COMMENT 'Enable automatic posting to Twitter/X';
ALTER TABLE news MODIFY COLUMN post_to_linkedin BOOLEAN DEFAULT FALSE COMMENT 'Enable automatic posting to LinkedIn';

ALTER TABLE press_releases MODIFY COLUMN post_to_twitter BOOLEAN DEFAULT FALSE COMMENT 'Enable automatic posting to Twitter/X';
ALTER TABLE press_releases MODIFY COLUMN post_to_linkedin BOOLEAN DEFAULT FALSE COMMENT 'Enable automatic posting to LinkedIn';

ALTER TABLE events MODIFY COLUMN post_to_twitter BOOLEAN DEFAULT FALSE COMMENT 'Enable automatic posting to Twitter/X';
ALTER TABLE events MODIFY COLUMN post_to_linkedin BOOLEAN DEFAULT FALSE COMMENT 'Enable automatic posting to LinkedIn';
