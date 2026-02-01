// src/middleware/languageMiddleware.js
/**
 * Language Detection Middleware
 *
 * Detects and sets the user's preferred language based on:
 * 1. Query parameter (?lang=en)
 * 2. Accept-Language header
 * 3. User/Client profile preferences
 * 4. Fallback to default language (English)
 *
 * Sets req.language with language code and full language object
 */

const db = require('../config/db');

// Cache for language data to avoid repeated DB queries
let languageCache = {
  languages: [],
  defaultLanguage: null,
  lastUpdated: null,
  cacheDuration: 5 * 60 * 1000 // 5 minutes
};

/**
 * Load all active languages from database
 */
async function loadLanguages() {
  const now = Date.now();

  // Return cached data if still valid
  if (languageCache.languages.length > 0 &&
      languageCache.lastUpdated &&
      (now - languageCache.lastUpdated) < languageCache.cacheDuration) {
    return languageCache;
  }

  try {
    const [languages] = await db.query(
      `SELECT id, code, name, native_name, is_default, direction, locale,
              date_format, time_format, decimal_separator, thousands_separator,
              currency_code, currency_symbol
       FROM languages
       WHERE is_active = TRUE`
    );

    const defaultLang = languages.find(lang => lang.is_default) || languages[0];

    languageCache = {
      languages,
      defaultLanguage: defaultLang,
      lastUpdated: now,
      cacheDuration: 5 * 60 * 1000
    };

    return languageCache;
  } catch (error) {
    console.error('Error loading languages:', error);

    // Return fallback if DB query fails
    if (languageCache.languages.length === 0) {
      languageCache.languages = [{
        id: 1,
        code: 'en',
        name: 'English',
        native_name: 'English',
        is_default: true,
        direction: 'ltr',
        locale: 'en-US',
        date_format: 'MM/DD/YYYY',
        time_format: 'hh:mm A',
        decimal_separator: '.',
        thousands_separator: ',',
        currency_code: 'USD',
        currency_symbol: '$'
      }];
      languageCache.defaultLanguage = languageCache.languages[0];
    }

    return languageCache;
  }
}

/**
 * Parse Accept-Language header
 * Returns array of language codes ordered by preference (quality values)
 */
function parseAcceptLanguage(header) {
  if (!header) return [];

  return header
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';');
      const code = parts[0].split('-')[0].toLowerCase(); // Get base language code (en from en-US)
      const quality = parts[1] ? parseFloat(parts[1].split('=')[1]) : 1.0;
      return { code, quality };
    })
    .sort((a, b) => b.quality - a.quality) // Sort by quality (preference)
    .map(item => item.code);
}

/**
 * Get user's preferred language from profile
 */
async function getUserPreferredLanguage(userId, isClient = false) {
  try {
    const field = isClient ? 'client_id' : 'user_id';
    const [preferences] = await db.query(
      `SELECT l.code, l.id, l.name, l.native_name, l.direction, l.locale,
              l.date_format, l.time_format, l.decimal_separator, l.thousands_separator,
              l.currency_code, l.currency_symbol
       FROM user_language_preferences ulp
       JOIN languages l ON ulp.language_id = l.id
       WHERE ulp.${field} = ? AND l.is_active = TRUE AND ulp.is_primary = TRUE
       LIMIT 1`,
      [userId]
    );

    return preferences[0] || null;
  } catch (error) {
    console.error('Error fetching user language preference:', error);
    return null;
  }
}

/**
 * Main language detection middleware
 */
const languageMiddleware = async (req, res, next) => {
  try {
    // Load available languages
    const { languages, defaultLanguage } = await loadLanguages();

    let selectedLanguage = null;

    // Priority 1: Query parameter (?lang=en)
    if (req.query.lang) {
      const langCode = req.query.lang.toLowerCase();
      selectedLanguage = languages.find(lang => lang.code === langCode);
    }

    // Priority 2: User/Client profile preference (if authenticated)
    if (!selectedLanguage) {
      let userId = null;
      let isClient = false;

      // Check if it's an authenticated internal user (JWT)
      if (req.user && req.user.userId) {
        userId = req.user.userId;
        isClient = false;
      }
      // Check if it's an authenticated client (session)
      else if (req.session && req.session.userId) {
        userId = req.session.userId;
        isClient = true;
      }

      if (userId) {
        const userLang = await getUserPreferredLanguage(userId, isClient);
        if (userLang) {
          selectedLanguage = userLang;
        }
      }
    }

    // Priority 3: Accept-Language header
    if (!selectedLanguage) {
      const acceptLanguageHeader = req.headers['accept-language'];
      if (acceptLanguageHeader) {
        const preferredCodes = parseAcceptLanguage(acceptLanguageHeader);

        // Find first matching language from user's preferences
        for (const code of preferredCodes) {
          const match = languages.find(lang => lang.code === code);
          if (match) {
            selectedLanguage = match;
            break;
          }
        }
      }
    }

    // Priority 4: Default language fallback
    if (!selectedLanguage) {
      selectedLanguage = defaultLanguage;
    }

    // Attach language info to request object
    req.language = {
      code: selectedLanguage.code,
      id: selectedLanguage.id,
      name: selectedLanguage.name,
      nativeName: selectedLanguage.native_name,
      direction: selectedLanguage.direction,
      locale: selectedLanguage.locale,
      formatting: {
        date: selectedLanguage.date_format,
        time: selectedLanguage.time_format,
        decimal: selectedLanguage.decimal_separator,
        thousands: selectedLanguage.thousands_separator,
        currency: {
          code: selectedLanguage.currency_code,
          symbol: selectedLanguage.currency_symbol
        }
      }
    };

    // Also attach all available languages for language switcher
    req.availableLanguages = languages.map(lang => ({
      code: lang.code,
      name: lang.name,
      nativeName: lang.native_name,
      direction: lang.direction
    }));

    next();
  } catch (error) {
    console.error('Language middleware error:', error);

    // Set safe fallback and continue
    req.language = {
      code: 'en',
      id: 1,
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
      locale: 'en-US',
      formatting: {
        date: 'MM/DD/YYYY',
        time: 'hh:mm A',
        decimal: '.',
        thousands: ',',
        currency: {
          code: 'USD',
          symbol: '$'
        }
      }
    };
    req.availableLanguages = [{ code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' }];

    next();
  }
};

/**
 * Function to manually refresh language cache
 * Useful when languages are added/updated
 */
languageMiddleware.refreshCache = async () => {
  languageCache.lastUpdated = null; // Force refresh
  return await loadLanguages();
};

module.exports = languageMiddleware;
