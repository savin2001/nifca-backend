-- Multi-Section Application Processing System Schema
-- Run this file against your MySQL database to set up the new tables

-- =====================================================
-- Application Types (e.g., "Financial Services License", "Company Registration")
-- =====================================================
CREATE TABLE IF NOT EXISTS application_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Application Sections (pages within an application type)
-- =====================================================
CREATE TABLE IF NOT EXISTS application_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_type_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT NOT NULL,
    is_required TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_type_id) REFERENCES application_types(id) ON DELETE CASCADE,
    UNIQUE KEY unique_section_order (application_type_id, display_order)
);

-- =====================================================
-- Section Fields (form fields within each section)
-- =====================================================
CREATE TABLE IF NOT EXISTS section_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type ENUM('text', 'textarea', 'number', 'email', 'date', 'select', 'checkbox', 'radio', 'file') NOT NULL,
    field_options JSON NULL COMMENT 'Options for select, checkbox, radio fields: [{"value": "x", "label": "X"}]',
    validation_rules JSON NULL COMMENT 'Validation rules: {"minLength": 3, "maxLength": 100, "pattern": "regex", "min": 0, "max": 100}',
    is_required TINYINT(1) DEFAULT 0,
    display_order INT NOT NULL,
    placeholder VARCHAR(255) NULL,
    help_text TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES application_sections(id) ON DELETE CASCADE,
    UNIQUE KEY unique_field_name (section_id, field_name)
);

-- =====================================================
-- Application Section Data (stores submitted data per section)
-- =====================================================
CREATE TABLE IF NOT EXISTS application_section_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    section_id INT NOT NULL,
    field_data JSON NOT NULL COMMENT 'Key-value pairs: {"field_name": "value", ...}',
    is_complete TINYINT(1) DEFAULT 0,
    validated_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES application_sections(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application_section (application_id, section_id)
);

-- =====================================================
-- Application Documents
-- =====================================================
CREATE TABLE IF NOT EXISTS application_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    section_id INT NULL,
    field_id INT NULL,
    document_type VARCHAR(100) NULL COMMENT 'Category of document (e.g., "ID Document", "Financial Statement")',
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL COMMENT 'File size in bytes',
    uploaded_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES application_sections(id) ON DELETE SET NULL,
    FOREIGN KEY (field_id) REFERENCES section_fields(id) ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by) REFERENCES clients(id)
);

-- =====================================================
-- Performance Indexes
-- =====================================================
CREATE INDEX idx_section_data_application ON application_section_data(application_id);
CREATE INDEX idx_documents_application ON application_documents(application_id);
CREATE INDEX idx_applications_client_status ON applications(client_id, status);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_application_types_active ON application_types(is_active);
CREATE INDEX idx_sections_type ON application_sections(application_type_id);
CREATE INDEX idx_fields_section ON section_fields(section_id);

-- =====================================================
-- Modify Existing applications Table
-- =====================================================
ALTER TABLE applications
    ADD COLUMN application_type_id INT NULL AFTER client_id,
    ADD COLUMN reference_number VARCHAR(50) NULL AFTER application_type_id,
    ADD COLUMN submitted_at DATETIME NULL AFTER status,
    ADD COLUMN pdf_path VARCHAR(500) NULL AFTER review_comments,
    ADD COLUMN pdf_generated_at DATETIME NULL AFTER pdf_path,
    ADD COLUMN current_section INT DEFAULT 1 AFTER pdf_generated_at,
    ADD COLUMN completion_percentage INT DEFAULT 0 AFTER current_section,
    MODIFY COLUMN status ENUM('draft', 'pending', 'submitted', 'under_review', 'approved', 'rejected', 'cancelled') DEFAULT 'draft',
    MODIFY COLUMN description TEXT NULL,
    ADD CONSTRAINT fk_application_type FOREIGN KEY (application_type_id) REFERENCES application_types(id),
    ADD UNIQUE KEY unique_reference (reference_number);

-- =====================================================
-- Sample Data: Application Type with Sections and Fields
-- =====================================================
-- Insert a sample application type
INSERT INTO application_types (name, code, description, is_active) VALUES
('Financial Services License', 'FSL', 'Application for obtaining a financial services license in the Nairobi International Finance Center', 1),
('Company Registration', 'CR', 'Application for registering a new company in NIFCA', 1);

-- Insert sections for Financial Services License
INSERT INTO application_sections (application_type_id, name, description, display_order, is_required) VALUES
((SELECT id FROM application_types WHERE code = 'FSL'), 'Company Information', 'Basic information about your company', 1, 1),
((SELECT id FROM application_types WHERE code = 'FSL'), 'Contact Details', 'Primary contact person and company address', 2, 1),
((SELECT id FROM application_types WHERE code = 'FSL'), 'Business Activities', 'Details about proposed financial services activities', 3, 1),
((SELECT id FROM application_types WHERE code = 'FSL'), 'Directors & Shareholders', 'Information about key personnel', 4, 1),
((SELECT id FROM application_types WHERE code = 'FSL'), 'Supporting Documents', 'Required documentation upload', 5, 1);

-- Insert fields for Company Information section
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
((SELECT id FROM application_sections WHERE name = 'Company Information' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'company_name', 'Company Name', 'text', NULL, '{"minLength": 3, "maxLength": 200}', 1, 1, 'Enter your company name', 'Legal name as registered'),
((SELECT id FROM application_sections WHERE name = 'Company Information' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'registration_number', 'Company Registration Number', 'text', NULL, '{"pattern": "^[A-Z0-9-]+$"}', 1, 2, 'e.g., ABC-123456', 'Your company registration number from the registrar'),
((SELECT id FROM application_sections WHERE name = 'Company Information' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'date_of_incorporation', 'Date of Incorporation', 'date', NULL, NULL, 1, 3, NULL, 'When was the company incorporated?'),
((SELECT id FROM application_sections WHERE name = 'Company Information' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'country_of_incorporation', 'Country of Incorporation', 'select', '[{"value": "KE", "label": "Kenya"}, {"value": "US", "label": "United States"}, {"value": "UK", "label": "United Kingdom"}, {"value": "OTHER", "label": "Other"}]', NULL, 1, 4, NULL, 'Select the country where your company is incorporated'),
((SELECT id FROM application_sections WHERE name = 'Company Information' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'company_type', 'Type of Company', 'select', '[{"value": "LLC", "label": "Limited Liability Company"}, {"value": "PLC", "label": "Public Limited Company"}, {"value": "BRANCH", "label": "Branch of Foreign Company"}]', NULL, 1, 5, NULL, NULL);

-- Insert fields for Contact Details section
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
((SELECT id FROM application_sections WHERE name = 'Contact Details' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'contact_person_name', 'Contact Person Name', 'text', NULL, '{"minLength": 2, "maxLength": 100}', 1, 1, 'Full name of primary contact', NULL),
((SELECT id FROM application_sections WHERE name = 'Contact Details' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'contact_email', 'Contact Email', 'email', NULL, NULL, 1, 2, 'email@company.com', NULL),
((SELECT id FROM application_sections WHERE name = 'Contact Details' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'contact_phone', 'Contact Phone', 'text', NULL, '{"pattern": "^[+]?[0-9\\\\s-]+$"}', 1, 3, '+254 XXX XXX XXX', NULL),
((SELECT id FROM application_sections WHERE name = 'Contact Details' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'physical_address', 'Physical Address', 'textarea', NULL, '{"minLength": 10, "maxLength": 500}', 1, 4, 'Street address, Building, Floor', NULL),
((SELECT id FROM application_sections WHERE name = 'Contact Details' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'postal_address', 'Postal Address', 'textarea', NULL, '{"maxLength": 300}', 0, 5, 'P.O. Box XXXXX, Nairobi', 'Optional');

-- Insert fields for Business Activities section
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
((SELECT id FROM application_sections WHERE name = 'Business Activities' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'proposed_activities', 'Proposed Financial Activities', 'checkbox', '[{"value": "BANKING", "label": "Banking Services"}, {"value": "INSURANCE", "label": "Insurance Services"}, {"value": "SECURITIES", "label": "Securities Trading"}, {"value": "FUND_MGMT", "label": "Fund Management"}, {"value": "FOREX", "label": "Foreign Exchange Services"}]', NULL, 1, 1, NULL, 'Select all that apply'),
((SELECT id FROM application_sections WHERE name = 'Business Activities' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'business_plan_summary', 'Business Plan Summary', 'textarea', NULL, '{"minLength": 100, "maxLength": 2000}', 1, 2, 'Provide a summary of your business plan...', 'Describe your proposed business activities, target market, and strategy'),
((SELECT id FROM application_sections WHERE name = 'Business Activities' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'projected_annual_revenue', 'Projected Annual Revenue (USD)', 'number', NULL, '{"min": 0}', 1, 3, '0', 'Estimated first year revenue'),
((SELECT id FROM application_sections WHERE name = 'Business Activities' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'initial_capital', 'Initial Capital Investment (USD)', 'number', NULL, '{"min": 0}', 1, 4, '0', 'Amount of capital to be invested');

-- Insert fields for Directors & Shareholders section
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
((SELECT id FROM application_sections WHERE name = 'Directors & Shareholders' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'number_of_directors', 'Number of Directors', 'number', NULL, '{"min": 1, "max": 50}', 1, 1, '0', NULL),
((SELECT id FROM application_sections WHERE name = 'Directors & Shareholders' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'director_names', 'Names of Directors', 'textarea', NULL, '{"minLength": 3}', 1, 2, 'List each director on a new line', 'Full legal names of all directors'),
((SELECT id FROM application_sections WHERE name = 'Directors & Shareholders' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'beneficial_owners', 'Beneficial Owners (>10% ownership)', 'textarea', NULL, NULL, 1, 3, 'Name - Percentage ownership', 'List all persons or entities with more than 10% ownership'),
((SELECT id FROM application_sections WHERE name = 'Directors & Shareholders' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'has_criminal_record', 'Do any directors have criminal records?', 'radio', '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]', NULL, 1, 4, NULL, 'This will be verified');

-- Insert fields for Supporting Documents section
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
((SELECT id FROM application_sections WHERE name = 'Supporting Documents' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'certificate_of_incorporation', 'Certificate of Incorporation', 'file', NULL, '{"accept": ".pdf,.jpg,.png", "maxSize": 10485760}', 1, 1, NULL, 'Upload a certified copy (PDF, JPG, or PNG, max 10MB)'),
((SELECT id FROM application_sections WHERE name = 'Supporting Documents' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'memorandum_articles', 'Memorandum & Articles of Association', 'file', NULL, '{"accept": ".pdf", "maxSize": 10485760}', 1, 2, NULL, 'Upload PDF document'),
((SELECT id FROM application_sections WHERE name = 'Supporting Documents' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'business_plan', 'Detailed Business Plan', 'file', NULL, '{"accept": ".pdf,.doc,.docx", "maxSize": 10485760}', 1, 3, NULL, 'Upload detailed business plan document'),
((SELECT id FROM application_sections WHERE name = 'Supporting Documents' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'financial_projections', 'Financial Projections', 'file', NULL, '{"accept": ".pdf,.xls,.xlsx", "maxSize": 10485760}', 1, 4, NULL, '5-year financial projections'),
((SELECT id FROM application_sections WHERE name = 'Supporting Documents' AND application_type_id = (SELECT id FROM application_types WHERE code = 'FSL')),
 'additional_documents', 'Additional Supporting Documents', 'file', NULL, '{"accept": ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png", "maxSize": 10485760}', 0, 5, NULL, 'Any other relevant documents (optional)');
