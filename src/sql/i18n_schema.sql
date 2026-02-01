-- ============================================
-- NIFCA Internationalization (i18n) Database Schema
-- ============================================
-- This schema implements comprehensive multilingual support with:
-- - Language management
-- - Dynamic content translations (news, events, press releases)
-- - System message translations (errors, validations, UI labels)
-- - Fallback support to default language
-- ============================================

-- ============================================
-- 1. LANGUAGES TABLE
-- Manages all supported languages in the system
-- ============================================
CREATE TABLE IF NOT EXISTS `languages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(10) NOT NULL UNIQUE COMMENT 'ISO 639-1 language code (e.g., en, fr, sw)',
  `name` VARCHAR(100) NOT NULL COMMENT 'Language name in English (e.g., English, French, Swahili)',
  `native_name` VARCHAR(100) NOT NULL COMMENT 'Language name in native script (e.g., English, Français, Kiswahili)',
  `is_default` BOOLEAN DEFAULT FALSE COMMENT 'Whether this is the default fallback language',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Whether this language is currently enabled',
  `direction` ENUM('ltr', 'rtl') DEFAULT 'ltr' COMMENT 'Text direction: left-to-right or right-to-left',
  `locale` VARCHAR(10) NOT NULL COMMENT 'Full locale code (e.g., en-US, fr-FR, sw-KE)',
  `date_format` VARCHAR(50) DEFAULT 'YYYY-MM-DD' COMMENT 'Preferred date format for this locale',
  `time_format` VARCHAR(50) DEFAULT 'HH:mm:ss' COMMENT 'Preferred time format for this locale',
  `decimal_separator` VARCHAR(5) DEFAULT '.' COMMENT 'Decimal separator character',
  `thousands_separator` VARCHAR(5) DEFAULT ',' COMMENT 'Thousands separator character',
  `currency_code` VARCHAR(10) DEFAULT 'USD' COMMENT 'Default currency code for this locale',
  `currency_symbol` VARCHAR(10) DEFAULT '$' COMMENT 'Currency symbol',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (`code`),
  INDEX idx_is_active (`is_active`),
  INDEX idx_is_default (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Supported languages and locale settings';

-- ============================================
-- 2. TRANSLATION KEYS TABLE
-- Stores system-wide translation keys for UI, errors, validations
-- ============================================
CREATE TABLE IF NOT EXISTS `translation_keys` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key_name` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique key identifier (e.g., error.not_found, label.submit)',
  `category` VARCHAR(100) NOT NULL COMMENT 'Category for organization (e.g., error, validation, label, message)',
  `description` TEXT COMMENT 'Description of what this key is used for',
  `context` VARCHAR(255) COMMENT 'Usage context for translators',
  `default_text` TEXT COMMENT 'Default English text',
  `supports_pluralization` BOOLEAN DEFAULT FALSE COMMENT 'Whether this key supports plural forms',
  `supports_interpolation` BOOLEAN DEFAULT FALSE COMMENT 'Whether this key supports variable interpolation',
  `interpolation_vars` JSON COMMENT 'JSON array of variable names used in interpolation',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key_name (`key_name`),
  INDEX idx_category (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System translation keys for messages, labels, errors';

-- ============================================
-- 3. TRANSLATIONS TABLE
-- Stores actual translations for each key in each language
-- ============================================
CREATE TABLE IF NOT EXISTS `translations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to translation_keys',
  `language_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to languages',
  `translation` TEXT NOT NULL COMMENT 'Translated text',
  `plural_form` ENUM('zero', 'one', 'two', 'few', 'many', 'other') DEFAULT 'other' COMMENT 'Plural form category',
  `is_verified` BOOLEAN DEFAULT FALSE COMMENT 'Whether translation is verified by native speaker',
  `verified_by` INT UNSIGNED COMMENT 'User ID who verified the translation',
  `verified_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`key_id`) REFERENCES `translation_keys`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `unique_translation` (`key_id`, `language_id`, `plural_form`),
  INDEX idx_key_language (`key_id`, `language_id`),
  INDEX idx_language (`language_id`),
  INDEX idx_is_verified (`is_verified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Actual translations for system keys';

-- ============================================
-- 4. NEWS TRANSLATIONS TABLE
-- Stores translations for news articles
-- ============================================
CREATE TABLE IF NOT EXISTS `news_translations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `news_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to news',
  `language_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to languages',
  `title` VARCHAR(500) NOT NULL COMMENT 'Translated news title',
  `content` TEXT NOT NULL COMMENT 'Translated news content',
  `meta_description` VARCHAR(500) COMMENT 'SEO meta description in this language',
  `meta_keywords` VARCHAR(500) COMMENT 'SEO keywords in this language',
  `slug` VARCHAR(500) COMMENT 'URL-friendly slug in this language',
  `is_published` BOOLEAN DEFAULT TRUE COMMENT 'Whether this translation is published',
  `translated_by` INT UNSIGNED COMMENT 'User ID who created the translation',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`translated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `unique_news_language` (`news_id`, `language_id`),
  INDEX idx_news_id (`news_id`),
  INDEX idx_language_id (`language_id`),
  INDEX idx_is_published (`is_published`),
  INDEX idx_slug (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Translations for news articles';

-- ============================================
-- 5. PRESS RELEASE TRANSLATIONS TABLE
-- Stores translations for press releases
-- ============================================
CREATE TABLE IF NOT EXISTS `press_release_translations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `press_release_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to press_releases',
  `language_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to languages',
  `title` VARCHAR(500) NOT NULL COMMENT 'Translated press release title',
  `content` TEXT NOT NULL COMMENT 'Translated press release content',
  `meta_description` VARCHAR(500) COMMENT 'SEO meta description in this language',
  `meta_keywords` VARCHAR(500) COMMENT 'SEO keywords in this language',
  `slug` VARCHAR(500) COMMENT 'URL-friendly slug in this language',
  `is_published` BOOLEAN DEFAULT TRUE COMMENT 'Whether this translation is published',
  `translated_by` INT UNSIGNED COMMENT 'User ID who created the translation',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`press_release_id`) REFERENCES `press_releases`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`translated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `unique_press_release_language` (`press_release_id`, `language_id`),
  INDEX idx_press_release_id (`press_release_id`),
  INDEX idx_language_id (`language_id`),
  INDEX idx_is_published (`is_published`),
  INDEX idx_slug (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Translations for press releases';

-- ============================================
-- 6. EVENT TRANSLATIONS TABLE
-- Stores translations for events
-- ============================================
CREATE TABLE IF NOT EXISTS `event_translations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to events',
  `language_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to languages',
  `title` VARCHAR(500) NOT NULL COMMENT 'Translated event title',
  `description` TEXT NOT NULL COMMENT 'Translated event description',
  `location` VARCHAR(500) COMMENT 'Translated location name',
  `meta_description` VARCHAR(500) COMMENT 'SEO meta description in this language',
  `meta_keywords` VARCHAR(500) COMMENT 'SEO keywords in this language',
  `slug` VARCHAR(500) COMMENT 'URL-friendly slug in this language',
  `is_published` BOOLEAN DEFAULT TRUE COMMENT 'Whether this translation is published',
  `translated_by` INT UNSIGNED COMMENT 'User ID who created the translation',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`translated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `unique_event_language` (`event_id`, `language_id`),
  INDEX idx_event_id (`event_id`),
  INDEX idx_language_id (`language_id`),
  INDEX idx_is_published (`is_published`),
  INDEX idx_slug (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Translations for events';

-- ============================================
-- 7. GALLERY MEDIA TRANSLATIONS TABLE
-- Stores translations for gallery media captions
-- ============================================
CREATE TABLE IF NOT EXISTS `gallery_translations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `gallery_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to gallery',
  `language_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to languages',
  `caption` TEXT COMMENT 'Translated media caption',
  `alt_text` VARCHAR(500) COMMENT 'Translated alt text for accessibility',
  `title` VARCHAR(500) COMMENT 'Translated media title',
  `description` TEXT COMMENT 'Translated media description',
  `translated_by` INT UNSIGNED COMMENT 'User ID who created the translation',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`gallery_id`) REFERENCES `gallery`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`translated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `unique_gallery_language` (`gallery_id`, `language_id`),
  INDEX idx_gallery_id (`gallery_id`),
  INDEX idx_language_id (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Translations for gallery media items';

-- ============================================
-- 8. TRANSLATION CACHE TABLE
-- Performance optimization: caches frequently accessed translations
-- ============================================
CREATE TABLE IF NOT EXISTS `translation_cache` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `cache_key` VARCHAR(500) NOT NULL UNIQUE COMMENT 'Unique cache key (e.g., news_123_en, system_error.not_found_fr)',
  `content` MEDIUMTEXT NOT NULL COMMENT 'Cached content (can be JSON or text)',
  `language_code` VARCHAR(10) NOT NULL COMMENT 'Language code for this cache entry',
  `content_type` VARCHAR(50) NOT NULL COMMENT 'Type of cached content (news, event, system_message)',
  `expires_at` TIMESTAMP NOT NULL COMMENT 'Cache expiration timestamp',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cache_key (`cache_key`),
  INDEX idx_expires_at (`expires_at`),
  INDEX idx_language_code (`language_code`),
  INDEX idx_content_type (`content_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Translation cache for performance optimization';

-- ============================================
-- 9. USER LANGUAGE PREFERENCES TABLE
-- Stores language preferences for users and clients
-- ============================================
CREATE TABLE IF NOT EXISTS `user_language_preferences` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED COMMENT 'Foreign key to users (for internal users)',
  `client_id` INT UNSIGNED COMMENT 'Foreign key to clients (for external clients)',
  `language_id` INT UNSIGNED NOT NULL COMMENT 'Preferred language',
  `is_primary` BOOLEAN DEFAULT TRUE COMMENT 'Primary language preference',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE CASCADE,
  INDEX idx_user_id (`user_id`),
  INDEX idx_client_id (`client_id`),
  INDEX idx_language_id (`language_id`),
  CHECK ((`user_id` IS NOT NULL AND `client_id` IS NULL) OR (`user_id` IS NULL AND `client_id` IS NOT NULL))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User and client language preferences';

-- ============================================
-- 10. SEED DATA - Default Languages
-- ============================================
INSERT INTO `languages` (`code`, `name`, `native_name`, `is_default`, `is_active`, `direction`, `locale`, `date_format`, `time_format`, `currency_code`, `currency_symbol`) VALUES
('en', 'English', 'English', TRUE, TRUE, 'ltr', 'en-US', 'MM/DD/YYYY', 'hh:mm A', 'USD', '$'),
('fr', 'French', 'Français', FALSE, TRUE, 'ltr', 'fr-FR', 'DD/MM/YYYY', 'HH:mm', 'EUR', '€'),
('sw', 'Swahili', 'Kiswahili', FALSE, TRUE, 'ltr', 'sw-KE', 'DD/MM/YYYY', 'HH:mm', 'KES', 'KSh'),
('ar', 'Arabic', 'العربية', FALSE, FALSE, 'rtl', 'ar-SA', 'DD/MM/YYYY', 'HH:mm', 'SAR', 'ر.س')
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- ============================================
-- 11. SEED DATA - Common System Translation Keys
-- ============================================
INSERT INTO `translation_keys` (`key_name`, `category`, `description`, `default_text`, `supports_pluralization`, `supports_interpolation`, `interpolation_vars`) VALUES
-- Authentication & Authorization
('auth.login_success', 'auth', 'Success message after login', 'Login successful', FALSE, FALSE, NULL),
('auth.logout_success', 'auth', 'Success message after logout', 'Logout successful', FALSE, FALSE, NULL),
('auth.invalid_credentials', 'auth', 'Error for invalid login credentials', 'Invalid email or password', FALSE, FALSE, NULL),
('auth.unauthorized', 'auth', 'Unauthorized access error', 'Unauthorized access', FALSE, FALSE, NULL),
('auth.token_expired', 'auth', 'JWT token expired error', 'Your session has expired. Please login again.', FALSE, FALSE, NULL),
('auth.account_disabled', 'auth', 'Account disabled error', 'Your account has been disabled. Please contact support.', FALSE, FALSE, NULL),

-- Validation Errors
('validation.required', 'validation', 'Required field error', 'This field is required', FALSE, FALSE, NULL),
('validation.email', 'validation', 'Invalid email format error', 'Please enter a valid email address', FALSE, FALSE, NULL),
('validation.min_length', 'validation', 'Minimum length validation error', 'Must be at least {min} characters', FALSE, TRUE, '["min"]'),
('validation.max_length', 'validation', 'Maximum length validation error', 'Must be no more than {max} characters', FALSE, TRUE, '["max"]'),
('validation.password_mismatch', 'validation', 'Password confirmation mismatch', 'Passwords do not match', FALSE, FALSE, NULL),
('validation.weak_password', 'validation', 'Weak password error', 'Password must contain uppercase, lowercase, number and special character', FALSE, FALSE, NULL),

-- General Errors
('error.not_found', 'error', 'Resource not found error', 'Resource not found', FALSE, FALSE, NULL),
('error.server_error', 'error', 'Internal server error', 'An internal server error occurred. Please try again later.', FALSE, FALSE, NULL),
('error.database_error', 'error', 'Database operation error', 'A database error occurred. Please try again.', FALSE, FALSE, NULL),
('error.permission_denied', 'error', 'Permission denied error', 'You do not have permission to perform this action', FALSE, FALSE, NULL),

-- Success Messages
('success.created', 'success', 'Resource created successfully', 'Created successfully', FALSE, FALSE, NULL),
('success.updated', 'success', 'Resource updated successfully', 'Updated successfully', FALSE, FALSE, NULL),
('success.deleted', 'success', 'Resource deleted successfully', 'Deleted successfully', FALSE, FALSE, NULL),

-- Pluralization Examples
('item.count', 'label', 'Item count with pluralization', '{count} item', TRUE, TRUE, '["count"]'),

-- Common Labels
('label.submit', 'label', 'Submit button label', 'Submit', FALSE, FALSE, NULL),
('label.cancel', 'label', 'Cancel button label', 'Cancel', FALSE, FALSE, NULL),
('label.save', 'label', 'Save button label', 'Save', FALSE, FALSE, NULL),
('label.edit', 'label', 'Edit button label', 'Edit', FALSE, FALSE, NULL),
('label.delete', 'label', 'Delete button label', 'Delete', FALSE, FALSE, NULL),
('label.search', 'label', 'Search button/placeholder', 'Search', FALSE, FALSE, NULL),
('label.loading', 'label', 'Loading indicator text', 'Loading...', FALSE, FALSE, NULL)
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- ============================================
-- 12. SEED DATA - Sample Translations (English)
-- ============================================
INSERT INTO `translations` (`key_id`, `language_id`, `translation`, `plural_form`)
SELECT tk.id, l.id, tk.default_text, 'other'
FROM `translation_keys` tk
CROSS JOIN `languages` l
WHERE l.code = 'en'
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- ============================================
-- 13. STORED PROCEDURES FOR TRANSLATION MANAGEMENT
-- ============================================

-- Procedure to get translation with fallback
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS `get_translation`(
  IN p_key_name VARCHAR(255),
  IN p_language_code VARCHAR(10),
  IN p_plural_form VARCHAR(10)
)
BEGIN
  DECLARE v_language_id INT;
  DECLARE v_default_language_id INT;
  DECLARE v_key_id INT;

  -- Get language IDs
  SELECT id INTO v_language_id FROM languages WHERE code = p_language_code AND is_active = TRUE LIMIT 1;
  SELECT id INTO v_default_language_id FROM languages WHERE is_default = TRUE LIMIT 1;
  SELECT id INTO v_key_id FROM translation_keys WHERE key_name = p_key_name LIMIT 1;

  -- Try to get translation in requested language
  SELECT t.translation, l.code as language_code, l.direction
  FROM translations t
  JOIN languages l ON t.language_id = l.id
  WHERE t.key_id = v_key_id
    AND t.language_id = v_language_id
    AND (p_plural_form IS NULL OR t.plural_form = p_plural_form)
  LIMIT 1;

  -- If not found, fallback to default language
  IF ROW_COUNT() = 0 THEN
    SELECT t.translation, l.code as language_code, l.direction
    FROM translations t
    JOIN languages l ON t.language_id = l.id
    WHERE t.key_id = v_key_id
      AND t.language_id = v_default_language_id
      AND (p_plural_form IS NULL OR t.plural_form = p_plural_form)
    LIMIT 1;
  END IF;

  -- If still not found, return the key name itself
  IF ROW_COUNT() = 0 THEN
    SELECT p_key_name as translation, p_language_code as language_code, 'ltr' as direction;
  END IF;
END//
DELIMITER ;

-- ============================================
-- 14. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================
-- Additional composite indexes for common query patterns
CREATE INDEX idx_news_translations_lookup ON news_translations (news_id, language_id, is_published);
CREATE INDEX idx_press_release_translations_lookup ON press_release_translations (press_release_id, language_id, is_published);
CREATE INDEX idx_event_translations_lookup ON event_translations (event_id, language_id, is_published);

-- ============================================
-- 15. CLEANUP PROCEDURE FOR EXPIRED CACHE
-- ============================================
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS `cleanup_expired_cache`()
BEGIN
  DELETE FROM translation_cache WHERE expires_at < NOW();
END//
DELIMITER ;

-- ============================================
-- 16. AUDIT LOG FOR TRANSLATION CHANGES
-- ============================================
CREATE TABLE IF NOT EXISTS `translation_audit_log` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `translation_id` INT UNSIGNED COMMENT 'Foreign key to translations',
  `action` VARCHAR(50) NOT NULL COMMENT 'Action performed (create, update, delete, verify)',
  `performed_by` INT UNSIGNED NOT NULL COMMENT 'User who performed the action',
  `old_value` TEXT COMMENT 'Previous translation value',
  `new_value` TEXT COMMENT 'New translation value',
  `ip_address` VARCHAR(45) COMMENT 'IP address of the user',
  `user_agent` VARCHAR(500) COMMENT 'User agent string',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`translation_id`) REFERENCES `translations`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`performed_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX idx_translation_id (`translation_id`),
  INDEX idx_performed_by (`performed_by`),
  INDEX idx_created_at (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Audit log for translation changes';

-- ============================================
-- END OF i18n SCHEMA
-- ============================================
