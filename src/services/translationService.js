// src/services/translationService.js
/**
 * Translation Service
 *
 * Provides comprehensive internationalization support including:
 * - System message translation with fallback
 * - Variable interpolation (e.g., "Hello {name}")
 * - Pluralization support
 * - In-memory caching for performance
 * - Batch translation loading
 */

const db = require('../config/db');

// In-memory cache for translations
const translationCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const CACHE_CHECK_INTERVAL = 60 * 1000; // Check for expired entries every minute

// Pluralization rules per language
const PLURAL_RULES = {
  en: (n) => {
    if (n === 0) return 'zero';
    if (n === 1) return 'one';
    return 'other';
  },
  fr: (n) => {
    if (n === 0) return 'zero';
    if (n === 1) return 'one';
    return 'other';
  },
  sw: (n) => {
    if (n === 1) return 'one';
    return 'other';
  },
  ar: (n) => {
    if (n === 0) return 'zero';
    if (n === 1) return 'one';
    if (n === 2) return 'two';
    if (n >= 3 && n <= 10) return 'few';
    if (n >= 11 && n <= 99) return 'many';
    return 'other';
  },
  default: (n) => {
    if (n === 0) return 'zero';
    if (n === 1) return 'one';
    return 'other';
  }
};

/**
 * Get plural form for a number in a given language
 */
function getPluralForm(languageCode, count) {
  const rule = PLURAL_RULES[languageCode] || PLURAL_RULES.default;
  return rule(count);
}

/**
 * Interpolate variables into translation string
 * Example: "Hello {name}" with {name: "John"} => "Hello John"
 */
function interpolate(text, variables) {
  if (!variables || typeof text !== 'string') return text;

  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return variables.hasOwnProperty(key) ? variables[key] : match;
  });
}

/**
 * Generate cache key for translation
 */
function getCacheKey(keyName, languageCode, pluralForm = null) {
  return `${keyName}:${languageCode}:${pluralForm || 'default'}`;
}

/**
 * Get translation from cache
 */
function getFromCache(keyName, languageCode, pluralForm = null) {
  const cacheKey = getCacheKey(keyName, languageCode, pluralForm);
  const cached = translationCache.get(cacheKey);

  if (!cached) return null;

  // Check if expired
  if (Date.now() > cached.expiresAt) {
    translationCache.delete(cacheKey);
    return null;
  }

  return cached.translation;
}

/**
 * Store translation in cache
 */
function setInCache(keyName, languageCode, translation, pluralForm = null) {
  const cacheKey = getCacheKey(keyName, languageCode, pluralForm);
  translationCache.set(cacheKey, {
    translation,
    expiresAt: Date.now() + CACHE_TTL
  });
}

/**
 * Clear expired cache entries (runs periodically)
 */
function clearExpiredCache() {
  const now = Date.now();
  for (const [key, value] of translationCache.entries()) {
    if (now > value.expiresAt) {
      translationCache.delete(key);
    }
  }
}

// Start periodic cache cleanup
setInterval(clearExpiredCache, CACHE_CHECK_INTERVAL);

/**
 * Get default language code
 */
async function getDefaultLanguageCode() {
  try {
    const [result] = await db.query(
      'SELECT code FROM languages WHERE is_default = TRUE LIMIT 1'
    );
    return result[0]?.code || 'en';
  } catch (error) {
    console.error('Error fetching default language:', error);
    return 'en';
  }
}

/**
 * Fetch translation from database
 */
async function fetchTranslationFromDB(keyName, languageCode, pluralForm = null) {
  try {
    const query = `
      SELECT t.translation, l.code as language_code, l.direction
      FROM translation_keys tk
      JOIN translations t ON tk.id = t.key_id
      JOIN languages l ON t.language_id = l.id
      WHERE tk.key_name = ?
        AND l.code = ?
        AND l.is_active = TRUE
        ${pluralForm ? 'AND t.plural_form = ?' : ''}
      LIMIT 1
    `;

    const params = pluralForm ? [keyName, languageCode, pluralForm] : [keyName, languageCode];
    const [results] = await db.query(query, params);

    if (results.length > 0) {
      return {
        translation: results[0].translation,
        languageCode: results[0].language_code,
        direction: results[0].direction
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching translation from DB:', error);
    return null;
  }
}

/**
 * Main translation function
 *
 * @param {string} keyName - Translation key (e.g., 'error.not_found')
 * @param {string} languageCode - Language code (e.g., 'en', 'fr')
 * @param {object} options - Additional options
 * @param {object} options.variables - Variables for interpolation
 * @param {number} options.count - Count for pluralization
 * @returns {Promise<string>} Translated string
 */
async function translate(keyName, languageCode = 'en', options = {}) {
  const { variables, count } = options;

  // Determine plural form if count is provided
  let pluralForm = null;
  if (typeof count === 'number') {
    pluralForm = getPluralForm(languageCode, count);
  }

  // Check cache first
  let translation = getFromCache(keyName, languageCode, pluralForm);

  if (!translation) {
    // Fetch from database
    let result = await fetchTranslationFromDB(keyName, languageCode, pluralForm);

    // If not found, try default plural form 'other'
    if (!result && pluralForm && pluralForm !== 'other') {
      result = await fetchTranslationFromDB(keyName, languageCode, 'other');
    }

    // If still not found, try default language
    if (!result) {
      const defaultLang = await getDefaultLanguageCode();
      if (defaultLang !== languageCode) {
        result = await fetchTranslationFromDB(keyName, defaultLang, pluralForm);

        // Try default plural form in default language
        if (!result && pluralForm && pluralForm !== 'other') {
          result = await fetchTranslationFromDB(keyName, defaultLang, 'other');
        }
      }
    }

    // Final fallback: return the key name itself
    translation = result ? result.translation : keyName;

    // Cache the result
    setInCache(keyName, languageCode, translation, pluralForm);
  }

  // Apply variable interpolation
  if (variables) {
    translation = interpolate(translation, variables);
  }

  // Apply count interpolation if provided
  if (typeof count === 'number' && !variables?.count) {
    translation = interpolate(translation, { count });
  }

  return translation;
}

/**
 * Batch translate multiple keys at once
 *
 * @param {string[]} keys - Array of translation keys
 * @param {string} languageCode - Language code
 * @returns {Promise<object>} Object with keys and their translations
 */
async function translateBatch(keys, languageCode = 'en') {
  const translations = {};

  // Fetch all requested translations in parallel
  await Promise.all(
    keys.map(async (key) => {
      translations[key] = await translate(key, languageCode);
    })
  );

  return translations;
}

/**
 * Preload translations for a category
 * Useful for loading all error messages or all labels at once
 *
 * @param {string} category - Category name (e.g., 'error', 'validation', 'label')
 * @param {string} languageCode - Language code
 * @returns {Promise<object>} Object with all translations in the category
 */
async function preloadCategory(category, languageCode = 'en') {
  try {
    const query = `
      SELECT tk.key_name, t.translation, t.plural_form
      FROM translation_keys tk
      JOIN translations t ON tk.id = t.key_id
      JOIN languages l ON t.language_id = l.id
      WHERE tk.category = ?
        AND l.code = ?
        AND l.is_active = TRUE
    `;

    const [results] = await db.query(query, [category, languageCode]);

    const translations = {};
    results.forEach(row => {
      const key = row.key_name;
      const pluralForm = row.plural_form || 'default';

      if (!translations[key]) {
        translations[key] = {};
      }

      if (pluralForm === 'other' || pluralForm === 'default') {
        translations[key] = row.translation;
      } else {
        if (typeof translations[key] === 'string') {
          const defaultValue = translations[key];
          translations[key] = { other: defaultValue };
        }
        translations[key][pluralForm] = row.translation;
      }

      // Cache each translation
      setInCache(key, languageCode, row.translation, row.plural_form);
    });

    return translations;
  } catch (error) {
    console.error('Error preloading category:', error);
    return {};
  }
}

/**
 * Clear all cached translations
 * Useful when translations are updated
 */
function clearCache() {
  translationCache.clear();
}

/**
 * Clear cache for a specific key
 */
function clearKeyCache(keyName) {
  for (const key of translationCache.keys()) {
    if (key.startsWith(keyName + ':')) {
      translationCache.delete(key);
    }
  }
}

/**
 * Get translation statistics
 */
function getCacheStats() {
  return {
    size: translationCache.size,
    keys: Array.from(translationCache.keys())
  };
}

/**
 * Helper function to create translation-aware response
 * Automatically translates common response fields
 */
async function createLocalizedResponse(languageCode, data) {
  const response = { ...data };

  // If there's a message field, try to translate it
  if (response.message && typeof response.message === 'string') {
    // Check if it's a translation key (contains dots)
    if (response.message.includes('.')) {
      response.message = await translate(response.message, languageCode);
    }
  }

  // If there are errors array, try to translate each
  if (response.errors && Array.isArray(response.errors)) {
    response.errors = await Promise.all(
      response.errors.map(async (error) => {
        if (typeof error === 'string' && error.includes('.')) {
          return await translate(error, languageCode);
        }
        if (error.msg && error.msg.includes('.')) {
          return {
            ...error,
            msg: await translate(error.msg, languageCode)
          };
        }
        return error;
      })
    );
  }

  return response;
}

module.exports = {
  translate,
  translateBatch,
  preloadCategory,
  getPluralForm,
  interpolate,
  clearCache,
  clearKeyCache,
  getCacheStats,
  createLocalizedResponse
};
