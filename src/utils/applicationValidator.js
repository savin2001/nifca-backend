// src/utils/applicationValidator.js

const applicationValidator = {
  /**
   * Validate a single field value against its field definition
   * @param {Object} field - Field definition from section_fields table
   * @param {any} value - The value to validate
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  validateField(field, value) {
    const errors = [];
    const rules = field.validation_rules || {};

    // Check required fields
    if (field.is_required) {
      if (value === undefined || value === null || value === "") {
        errors.push(`${field.field_label} is required`);
        return { valid: false, errors };
      }
      // For arrays (checkboxes), check if empty
      if (Array.isArray(value) && value.length === 0) {
        errors.push(`${field.field_label} is required`);
        return { valid: false, errors };
      }
    }

    // If value is empty and not required, skip other validations
    if (value === undefined || value === null || value === "") {
      return { valid: true, errors: [] };
    }

    // Type-specific validations
    switch (field.field_type) {
      case "text":
      case "textarea":
        if (typeof value !== "string") {
          errors.push(`${field.field_label} must be text`);
        } else {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field.field_label} must be at least ${rules.minLength} characters`);
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field.field_label} must be at most ${rules.maxLength} characters`);
          }
          if (rules.pattern) {
            const regex = new RegExp(rules.pattern);
            if (!regex.test(value)) {
              errors.push(`${field.field_label} format is invalid`);
            }
          }
        }
        break;

      case "number":
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`${field.field_label} must be a number`);
        } else {
          if (rules.min !== undefined && num < rules.min) {
            errors.push(`${field.field_label} must be at least ${rules.min}`);
          }
          if (rules.max !== undefined && num > rules.max) {
            errors.push(`${field.field_label} must be at most ${rules.max}`);
          }
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${field.field_label} must be a valid email address`);
        }
        break;

      case "date":
        const dateValue = new Date(value);
        if (isNaN(dateValue.getTime())) {
          errors.push(`${field.field_label} must be a valid date`);
        } else {
          if (rules.minDate) {
            const minDate = new Date(rules.minDate);
            if (dateValue < minDate) {
              errors.push(`${field.field_label} must be on or after ${rules.minDate}`);
            }
          }
          if (rules.maxDate) {
            const maxDate = new Date(rules.maxDate);
            if (dateValue > maxDate) {
              errors.push(`${field.field_label} must be on or before ${rules.maxDate}`);
            }
          }
        }
        break;

      case "select":
      case "radio":
        if (field.field_options && Array.isArray(field.field_options)) {
          const validValues = field.field_options.map((opt) => opt.value);
          if (!validValues.includes(value)) {
            errors.push(`${field.field_label} has an invalid selection`);
          }
        }
        break;

      case "checkbox":
        if (!Array.isArray(value)) {
          errors.push(`${field.field_label} must be an array of values`);
        } else if (field.field_options && Array.isArray(field.field_options)) {
          const validValues = field.field_options.map((opt) => opt.value);
          for (const v of value) {
            if (!validValues.includes(v)) {
              errors.push(`${field.field_label} contains an invalid option: ${v}`);
            }
          }
        }
        break;

      case "file":
        // File validation is typically handled during upload
        // Here we just check if a file reference exists
        if (field.is_required && !value) {
          errors.push(`${field.field_label} is required`);
        }
        break;
    }

    return { valid: errors.length === 0, errors };
  },

  /**
   * Validate all fields in a section
   * @param {Object[]} fields - Array of field definitions
   * @param {Object} fieldData - Key-value pairs of field_name: value
   * @returns {Object} - { valid: boolean, errors: { fieldName: string[] } }
   */
  validateSection(fields, fieldData) {
    const errors = {};
    let isValid = true;

    for (const field of fields) {
      // Skip file fields as they're validated separately during upload
      if (field.field_type === "file") continue;

      const value = fieldData[field.field_name];
      const result = this.validateField(field, value);

      if (!result.valid) {
        errors[field.field_name] = result.errors;
        isValid = false;
      }
    }

    return { valid: isValid, errors };
  },

  /**
   * Check if a section has all required fields filled
   * @param {Object[]} fields - Array of field definitions
   * @param {Object} fieldData - Key-value pairs of field_name: value
   * @returns {boolean}
   */
  isSectionComplete(fields, fieldData) {
    for (const field of fields) {
      // Skip file fields as they're checked separately
      if (field.field_type === "file") continue;

      if (field.is_required) {
        const value = fieldData[field.field_name];
        if (value === undefined || value === null || value === "") {
          return false;
        }
        if (Array.isArray(value) && value.length === 0) {
          return false;
        }
      }
    }
    return true;
  },

  /**
   * Get missing required fields in a section
   * @param {Object[]} fields - Array of field definitions
   * @param {Object} fieldData - Key-value pairs of field_name: value
   * @returns {string[]} - Array of missing field labels
   */
  getMissingRequiredFields(fields, fieldData) {
    const missing = [];

    for (const field of fields) {
      if (field.is_required) {
        const value = fieldData[field.field_name];
        if (value === undefined || value === null || value === "") {
          missing.push(field.field_label);
        } else if (Array.isArray(value) && value.length === 0) {
          missing.push(field.field_label);
        }
      }
    }

    return missing;
  },

  /**
   * Sanitize field data - remove any fields not in the field definitions
   * @param {Object[]} fields - Array of field definitions
   * @param {Object} fieldData - Key-value pairs of field_name: value
   * @returns {Object} - Sanitized field data
   */
  sanitizeFieldData(fields, fieldData) {
    const validFieldNames = fields.map((f) => f.field_name);
    const sanitized = {};

    for (const [key, value] of Object.entries(fieldData)) {
      if (validFieldNames.includes(key)) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  },

  /**
   * Validate file upload against field rules
   * @param {Object} field - Field definition
   * @param {Object} file - Multer file object
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  validateFileUpload(field, file) {
    const errors = [];
    const rules = field.validation_rules || {};

    if (!file) {
      if (field.is_required) {
        errors.push(`${field.field_label} is required`);
      }
      return { valid: errors.length === 0, errors };
    }

    // Check file size
    if (rules.maxSize && file.size > rules.maxSize) {
      const maxSizeMB = (rules.maxSize / (1024 * 1024)).toFixed(1);
      errors.push(`${field.field_label} must be smaller than ${maxSizeMB}MB`);
    }

    // Check file type/extension
    if (rules.accept) {
      const acceptedTypes = rules.accept.split(",").map((t) => t.trim().toLowerCase());
      const fileExt = "." + file.originalname.split(".").pop().toLowerCase();
      const fileMime = file.mimetype.toLowerCase();

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return type === fileExt;
        }
        return type === fileMime || fileMime.startsWith(type.replace("*", ""));
      });

      if (!isAccepted) {
        errors.push(`${field.field_label} must be one of: ${rules.accept}`);
      }
    }

    return { valid: errors.length === 0, errors };
  },
};

module.exports = applicationValidator;
