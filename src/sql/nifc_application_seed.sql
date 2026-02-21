-- =====================================================
-- NIFC Firm Certification — Application Seed Data
-- Replaces old FSL/CR placeholder types with the
-- official 7-section NIFC application form.
-- =====================================================

-- Step 0: Widen field_label to support long declaration statements
ALTER TABLE section_fields MODIFY COLUMN field_label TEXT NOT NULL;

-- Step 1: Clean up old seed data
-- Deactivate old application types (safe — preserves FK references)
UPDATE application_types SET is_active = 0 WHERE code IN ('FSL', 'CR');

-- Step 2: Insert the new application type
INSERT INTO application_types (name, code, description, is_active) VALUES
('NIFC Firm Certification', 'NFC',
 'Application for certification as a firm within the Nairobi International Financial Centre. This form covers the Declaration, Core Information (Parts 1–5), and Supporting Documents.',
 1);

-- Capture the new type id for re-use
SET @nfc_type_id = LAST_INSERT_ID();

-- =====================================================
-- SECTIONS (7 steps)
-- =====================================================
INSERT INTO application_sections (application_type_id, name, description, display_order, is_required) VALUES
(@nfc_type_id, 'Declaration',
 'Please read each statement carefully and confirm your agreement before proceeding.',
 1, 1),
(@nfc_type_id, 'Part 1 — General Information',
 'Provide basic information about the applicant company, its incorporation details, and proposed activities.',
 2, 1),
(@nfc_type_id, 'Part 2 — Contact Information',
 'Provide contact details for the primary contact person, the most senior executive, and any professional adviser.',
 3, 1),
(@nfc_type_id, 'Part 3 — Group Structure, Controllers & Funding',
 'Provide details about the applicant''s group structure, parent company, ownership, and governance.',
 4, 1),
(@nfc_type_id, 'Part 4 — Operations in the NIFC',
 'Describe the applicant''s operational history, proposed products and services, risk management, compliance, and related matters.',
 5, 1),
(@nfc_type_id, 'Part 5 — Business Plan',
 'Summarise the applicant''s track record, economic contribution, strategic plans, innovation, and environmental impact.',
 6, 1),
(@nfc_type_id, 'Supporting Documents',
 'Upload all required supporting documentation. Accepted formats include PDF, DOC, DOCX, XLS, XLSX, JPG, and PNG (max 10 MB each).',
 7, 1);

-- =====================================================
-- HELPER: Capture section IDs
-- =====================================================
SET @sec_declaration  = (SELECT id FROM application_sections WHERE application_type_id = @nfc_type_id AND display_order = 1);
SET @sec_general      = (SELECT id FROM application_sections WHERE application_type_id = @nfc_type_id AND display_order = 2);
SET @sec_contact      = (SELECT id FROM application_sections WHERE application_type_id = @nfc_type_id AND display_order = 3);
SET @sec_group        = (SELECT id FROM application_sections WHERE application_type_id = @nfc_type_id AND display_order = 4);
SET @sec_operations   = (SELECT id FROM application_sections WHERE application_type_id = @nfc_type_id AND display_order = 5);
SET @sec_business     = (SELECT id FROM application_sections WHERE application_type_id = @nfc_type_id AND display_order = 6);
SET @sec_documents    = (SELECT id FROM application_sections WHERE application_type_id = @nfc_type_id AND display_order = 7);

-- =====================================================
-- SECTION 1: Declaration
-- =====================================================
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
(@sec_declaration, 'declaration_authority',
 'I confirm that I have the authority to sign and submit this application on behalf of the applicant.',
 'checkbox', '[{"value":"agreed","label":"I agree"}]', NULL, 1, 1, NULL, NULL),

(@sec_declaration, 'declaration_accuracy',
 'I declare that, to the best of my knowledge, the information provided in this form is true, complete, and accurate. I understand that providing false or misleading information may result in the application being refused or any certification granted being revoked.',
 'checkbox', '[{"value":"agreed","label":"I agree"}]', NULL, 1, 2, NULL, NULL),

(@sec_declaration, 'declaration_additional_info',
 'I confirm my understanding that the NIFC Authority may request more detailed information or documentation in support of this application, and I undertake to provide such information promptly.',
 'checkbox', '[{"value":"agreed","label":"I agree"}]', NULL, 1, 3, NULL, NULL),

(@sec_declaration, 'declaration_data_use',
 'I understand that any data provided to the NIFC Authority in this application will be used for the purposes of assessing this application and for ongoing regulatory and supervisory purposes.',
 'checkbox', '[{"value":"agreed","label":"I agree"}]', NULL, 1, 4, NULL, NULL),

(@sec_declaration, 'declarant_name',
 'Full Name of Declarant', 'text', NULL,
 '{"minLength":2,"maxLength":200}', 1, 5,
 'Enter your full name', 'The name of the person authorised to submit this application.'),

(@sec_declaration, 'declarant_position',
 'Position / Title', 'text', NULL,
 '{"minLength":2,"maxLength":150}', 1, 6,
 'e.g. Chief Executive Officer', 'Your role or title within the applicant organisation.'),

(@sec_declaration, 'declaration_date',
 'Date', 'date', NULL, NULL, 1, 7, NULL,
 'The date on which this declaration is made.');

-- =====================================================
-- SECTION 2: Part 1 — General Information
-- =====================================================
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
(@sec_general, 'company_name',
 'Company Name', 'text', NULL,
 '{"minLength":2,"maxLength":300}', 1, 1,
 'e.g. Acme Holdings Ltd (trading as Acme Finance)',
 'Include any trading name in brackets.'),

(@sec_general, 'date_of_incorporation',
 'Date of Incorporation', 'date', NULL, NULL, 1, 2, NULL,
 'The date on which the company was formally incorporated.'),

(@sec_general, 'registration_number',
 'Business Registration Number', 'text', NULL,
 '{"minLength":1,"maxLength":100}', 1, 3,
 'e.g. PVT-2024-08832', 'The registration or company number issued at incorporation.'),

(@sec_general, 'country_of_incorporation',
 'Country of Incorporation', 'select',
 '[{"value":"Kenya","label":"Kenya"},{"value":"Other","label":"Other (please specify in the address field)"}]',
 NULL, 1, 4, NULL, 'Select the country in which the company was incorporated.'),

(@sec_general, 'registered_address',
 'Registered Office Address', 'textarea', NULL,
 '{"minLength":10,"maxLength":500}', 1, 5,
 'Street address, Building, Floor, City, Country',
 'The full registered address of the applicant company.'),

(@sec_general, 'telephone_number',
 'Telephone Number', 'text', NULL,
 '{"maxLength":30}', 1, 6,
 '+254 XXX XXX XXX', NULL),

(@sec_general, 'email_address',
 'Email Address', 'email', NULL, NULL, 1, 7,
 'info@company.co.ke', NULL),

(@sec_general, 'principal_activities',
 'Principal Activities (Current and Proposed)', 'textarea', NULL,
 '{"minLength":20,"maxLength":3000}', 1, 8,
 'Describe the applicant''s current and proposed business activities...',
 'Provide a clear description of the applicant''s current activities and those it proposes to undertake within the NIFC.'),

(@sec_general, 'proposed_structure',
 'Proposed Structure', 'select',
 '[{"value":"Branch","label":"Branch"},{"value":"Subsidiary","label":"Subsidiary"},{"value":"New Entity","label":"New Entity"}]',
 NULL, 1, 9, NULL,
 'Select the legal structure through which the applicant proposes to operate in the NIFC.'),

(@sec_general, 'regulatory_licence',
 'Does the applicant require a licence from any regulator in Kenya?', 'textarea', NULL,
 '{"maxLength":2000}', 1, 10,
 'If yes, provide details including the regulator and licence type...',
 'If so, please provide full details of the regulator, the type of licence, and the current status of the application.'),

(@sec_general, 'financial_year_period',
 'Financial Year Period', 'text', NULL,
 '{"maxLength":100}', 1, 11,
 'e.g. 1 January – 31 December',
 'State the start and end dates of the applicant''s financial year.');

-- =====================================================
-- SECTION 3: Part 2 — Contact Information
-- =====================================================
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
(@sec_contact, 'contact_person_name',
 'Contact Person — Full Name', 'text', NULL,
 '{"minLength":2,"maxLength":200}', 1, 1,
 'Full name of the designated contact person', NULL),

(@sec_contact, 'contact_person_phone',
 'Contact Person — Telephone', 'text', NULL,
 '{"maxLength":30}', 1, 2,
 '+254 XXX XXX XXX', NULL),

(@sec_contact, 'contact_person_email',
 'Contact Person — Email Address', 'email', NULL, NULL, 1, 3,
 'contact@company.co.ke', NULL),

(@sec_contact, 'contact_person_address',
 'Contact Person — Postal Address', 'textarea', NULL,
 '{"maxLength":500}', 1, 4,
 'P.O. Box XXXXX-00100, Nairobi', NULL),

(@sec_contact, 'senior_executive_name',
 'Senior Executive (e.g. CEO) — Full Name', 'text', NULL,
 '{"minLength":2,"maxLength":200}', 1, 5,
 'Full name of the most senior executive', NULL),

(@sec_contact, 'senior_executive_phone',
 'Senior Executive — Telephone', 'text', NULL,
 '{"maxLength":30}', 1, 6,
 '+254 XXX XXX XXX', NULL),

(@sec_contact, 'senior_executive_email',
 'Senior Executive — Email Address', 'email', NULL, NULL, 1, 7,
 'ceo@company.co.ke', NULL),

(@sec_contact, 'senior_executive_address',
 'Senior Executive — Postal Address', 'textarea', NULL,
 '{"maxLength":500}', 1, 8,
 'P.O. Box XXXXX-00100, Nairobi', NULL),

(@sec_contact, 'professional_adviser_name',
 'Professional Adviser — Full Name', 'text', NULL,
 '{"maxLength":200}', 0, 9,
 'Full name of professional adviser (if applicable)', 'Leave blank if not applicable.'),

(@sec_contact, 'professional_adviser_phone',
 'Professional Adviser — Telephone', 'text', NULL,
 '{"maxLength":30}', 0, 10,
 '+254 XXX XXX XXX', NULL),

(@sec_contact, 'professional_adviser_email',
 'Professional Adviser — Email Address', 'email', NULL, NULL, 0, 11,
 'adviser@firm.co.ke', NULL),

(@sec_contact, 'professional_adviser_address',
 'Professional Adviser — Postal Address', 'textarea', NULL,
 '{"maxLength":500}', 0, 12,
 'P.O. Box XXXXX-00100, Nairobi', NULL),

(@sec_contact, 'copy_adviser_correspondence',
 'Copy adviser on future correspondence?', 'radio',
 '[{"value":"yes","label":"Yes"},{"value":"no","label":"No"}]',
 NULL, 0, 13, NULL,
 'Select whether future correspondence from the NIFC Authority should also be sent to the professional adviser.');

-- =====================================================
-- SECTION 4: Part 3 — Group Structure, Controllers & Funding
-- =====================================================
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
(@sec_group, 'group_membership',
 'Is the applicant a member of a group? If so, provide details of the group structure.',
 'textarea', NULL, '{"minLength":5,"maxLength":3000}', 1, 1,
 'Describe the group structure or state "Not applicable"...',
 'Include a description of the overall group and the applicant''s position within it.'),

(@sec_group, 'parent_company_regulated',
 'Is the parent or holding company regulated by any Kenyan or overseas regulator?',
 'textarea', NULL, '{"maxLength":2000}', 1, 2,
 'Provide details or state "Not applicable"...',
 'Include the name of the regulator and the nature of the authorisation.'),

(@sec_group, 'consolidated_supervision',
 'Is the applicant or any group member subject to consolidated supervision?',
 'textarea', NULL, '{"maxLength":2000}', 1, 3,
 'Provide details or state "Not applicable"...',
 'State the name of the consolidating supervisor if applicable.'),

(@sec_group, 'parent_company_details',
 'Parent company details (name, registration number, contact, address, percentage holding, legal designation).',
 'textarea', NULL, '{"maxLength":3000}', 1, 4,
 'Provide full details of the parent or holding company...',
 'If there is no parent company, state "Not applicable".'),

(@sec_group, 'parent_listed_exchange',
 'Is the parent company listed on any recognised stock exchange? If so, which one?',
 'textarea', NULL, '{"maxLength":1000}', 0, 5,
 'e.g. Nairobi Securities Exchange (NSE)', NULL),

(@sec_group, 'ownership_details',
 'Full ownership details including beneficiaries and percentage shareholding.',
 'textarea', NULL, '{"minLength":10,"maxLength":5000}', 1, 6,
 'List each owner with percentage shareholding...',
 'Include all natural persons who are ultimate beneficial owners.'),

(@sec_group, 'board_of_directors',
 'Details of each member of the board of directors or governing body.',
 'textarea', NULL, '{"minLength":10,"maxLength":5000}', 1, 7,
 'Name, nationality, role, date of appointment...',
 'List each director with their full name, nationality, position, and date of appointment.'),

(@sec_group, 'senior_management',
 'Details of the senior executive management officers.',
 'textarea', NULL, '{"minLength":10,"maxLength":5000}', 1, 8,
 'Name, role, qualifications, experience...',
 'Include chief executive, finance director, compliance officer, and other key individuals.');

-- =====================================================
-- SECTION 5: Part 4 — Operations in the NIFC
-- =====================================================
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
(@sec_operations, 'years_operational',
 'How long has the applicant been operational?', 'text', NULL,
 '{"maxLength":100}', 1, 1,
 'e.g. 5 years', 'State the number of years the applicant has been in operation.'),

(@sec_operations, 'business_transfer',
 'Is any business being transferred from another entity (e.g. merger or takeover)?',
 'textarea', NULL, '{"maxLength":2000}', 1, 2,
 'Provide details or state "No"...',
 'If yes, provide full details including the name of the transferring entity.'),

(@sec_operations, 'expected_client_base',
 'Expected client base (retail, professional, market counterparty, etc.).',
 'textarea', NULL, '{"minLength":10,"maxLength":2000}', 1, 3,
 'Describe the types of clients the applicant expects to serve...',
 'Indicate the expected proportion of each client category.'),

(@sec_operations, 'products_services',
 'Types of products or services the applicant offers.',
 'textarea', NULL, '{"minLength":10,"maxLength":3000}', 1, 4,
 'List and describe the products or services...',
 'Provide a clear description of each product or service.'),

(@sec_operations, 'third_party_products',
 'Will any products or services be developed or offered by another firm or third party?',
 'textarea', NULL, '{"maxLength":2000}', 1, 5,
 'Provide details or state "No"...',
 'If yes, identify the third party and describe the arrangement.'),

(@sec_operations, 'risk_management',
 'Does the applicant have a risk management specialist? If so, describe the proposed system.',
 'textarea', NULL, '{"minLength":10,"maxLength":3000}', 1, 6,
 'Describe the risk management framework and key personnel...',
 'Include details of the risk management specialist and the systems or frameworks in place.'),

(@sec_operations, 'internal_auditing',
 'Who will be responsible for internal auditing and how frequently will audits be carried out?',
 'textarea', NULL, '{"minLength":10,"maxLength":2000}', 1, 7,
 'Name of internal auditor or audit function, frequency...',
 'Describe the internal audit arrangements and the planned frequency of audits.'),

(@sec_operations, 'indemnity_insurance',
 'Will the applicant have professional indemnity insurance in place?',
 'textarea', NULL, '{"maxLength":2000}', 1, 8,
 'Provide details including proposed insurer and coverage level, or state "No"...',
 'If yes, provide the name of the insurer, coverage amount, and scope.'),

(@sec_operations, 'cyber_security_plan',
 'Will the applicant have a cyber security plan in place?',
 'textarea', NULL, '{"maxLength":2000}', 1, 9,
 'Describe the cyber security plan or state "No"...',
 'Include details of key policies, incident response, and data protection measures.'),

(@sec_operations, 'third_party_providers',
 'Does the applicant plan to engage third-party service providers for key functions?',
 'textarea', NULL, '{"maxLength":3000}', 1, 10,
 'List each outsourced function and the third-party provider...',
 'If yes, identify each function, the provider, and the governance arrangements.'),

(@sec_operations, 'external_auditor',
 'Details about the applicant''s external auditor.',
 'textarea', NULL, '{"minLength":5,"maxLength":2000}', 1, 11,
 'Name of audit firm, lead partner, address...',
 'Provide the name, address, and relevant contact details of the external auditor.'),

(@sec_operations, 'organisation_size',
 'Targeted size of the organisation (number of employees) and proposed organisational structure.',
 'textarea', NULL, '{"minLength":5,"maxLength":3000}', 1, 12,
 'e.g. 25 employees across 4 departments...',
 'Include the proposed number of employees and a summary of the organisational structure.'),

(@sec_operations, 'client_money',
 'Will the applicant hold any client money or client investments?',
 'textarea', NULL, '{"maxLength":2000}', 1, 13,
 'Provide details or state "No"...',
 'If yes, describe the safeguarding arrangements.'),

(@sec_operations, 'retail_complaints',
 'Will the applicant have retail customers? If so, describe arrangements for handling complaints.',
 'textarea', NULL, '{"maxLength":2000}', 0, 14,
 'Describe the complaints handling procedure or state "Not applicable"...',
 'Include details of the complaints handling procedure and any relevant ombudsman membership.'),

(@sec_operations, 'record_keeping',
 'Arrangements for record keeping and data protection.',
 'textarea', NULL, '{"minLength":10,"maxLength":3000}', 1, 15,
 'Describe the record-keeping and data-protection policies...',
 'Describe how records will be maintained and how personal data will be protected.'),

(@sec_operations, 'pending_investigations',
 'Has the applicant or any board member been subject to any current or pending investigation?',
 'textarea', NULL, '{"minLength":2,"maxLength":3000}', 1, 16,
 'Provide details or state "No"...',
 'Disclose any current or pending investigation, prosecution, or enforcement action.'),

(@sec_operations, 'past_disciplinary',
 'Has the applicant or group been censured, disciplined, or investigated in the last 10 years?',
 'textarea', NULL, '{"minLength":2,"maxLength":3000}', 1, 17,
 'Provide details or state "No"...',
 'Include all censures, disciplinary actions, or adverse findings in the last 10 years.'),

(@sec_operations, 'aml_policies',
 'Details of anti-money laundering policies and related procedures in place.',
 'textarea', NULL, '{"minLength":10,"maxLength":3000}', 1, 18,
 'Describe AML/CFT policies, procedures, and controls...',
 'Summarise the applicant''s AML/CFT framework including customer due diligence and suspicious activity reporting.');

-- =====================================================
-- SECTION 6: Part 5 — Business Plan
-- =====================================================
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
(@sec_business, 'performance_track_record',
 'Performance and track record for the previous three years (where applicable).',
 'textarea', NULL, '{"minLength":10,"maxLength":5000}', 1, 1,
 'Summarise key financial and operational performance indicators...',
 'Where available, include revenue, assets under management, profitability, and any relevant benchmarks.'),

(@sec_business, 'economic_contribution',
 'Likely contribution of the applicant to the economy.',
 'textarea', NULL, '{"minLength":10,"maxLength":3000}', 1, 2,
 'Describe the expected economic impact...',
 'Include expected job creation, tax contribution, capital investment, and knowledge transfer.'),

(@sec_business, 'business_plan_kenya',
 'Overall plan for the business in Kenya or regionally.',
 'textarea', NULL, '{"minLength":10,"maxLength":5000}', 1, 3,
 'Outline the strategic plan for operations in Kenya and the region...',
 'Describe the applicant''s short-, medium-, and long-term objectives for its operations in Kenya and the wider region.'),

(@sec_business, 'innovation_expertise',
 'Level of innovation, specialism or expertise of the business.',
 'textarea', NULL, '{"minLength":10,"maxLength":3000}', 1, 4,
 'Describe areas of innovation, specialism, or competitive advantage...',
 'Highlight any innovative products, proprietary technology, or niche expertise.'),

(@sec_business, 'environmental_social_impact',
 'Environmental and social impact of the business.',
 'textarea', NULL, '{"minLength":10,"maxLength":3000}', 1, 5,
 'Describe the environmental and social impact or commitments...',
 'Include any ESG policies, sustainability commitments, or social impact initiatives.');

-- =====================================================
-- SECTION 7: Supporting Documents
-- =====================================================
INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text) VALUES
(@sec_documents, 'business_plan_doc',
 'Business Plan', 'file', NULL,
 '{"accept":".pdf,.doc,.docx","maxSize":10485760}', 1, 1, NULL,
 'Upload a comprehensive business plan document (PDF, DOC, or DOCX — max 10 MB).'),

(@sec_documents, 'certificate_of_incorporation',
 'Certificate of Incorporation', 'file', NULL,
 '{"accept":".pdf,.jpg,.png","maxSize":10485760}', 1, 2, NULL,
 'Upload a certified copy of the certificate of incorporation (PDF, JPG, or PNG — max 10 MB).'),

(@sec_documents, 'group_structure_doc',
 'Group Structure Documentation', 'file', NULL,
 '{"accept":".pdf,.doc,.docx,.jpg,.png","maxSize":10485760}', 0, 3, NULL,
 'Upload a diagram or document illustrating the group structure (optional).'),

(@sec_documents, 'board_executive_resumes',
 'Resumes of Board / Executive Members', 'file', NULL,
 '{"accept":".pdf,.doc,.docx","maxSize":10485760}', 1, 4, NULL,
 'Upload CVs or resumes of all board members and senior executives (PDF or DOC — max 10 MB).'),

(@sec_documents, 'audited_accounts',
 'Latest Audited Accounts', 'file', NULL,
 '{"accept":".pdf,.xls,.xlsx","maxSize":10485760}', 1, 5, NULL,
 'Upload the most recent audited financial statements (PDF or Excel — max 10 MB).'),

(@sec_documents, 'additional_documents',
 'Additional Supporting Documents', 'file', NULL,
 '{"accept":".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png","maxSize":10485760}', 0, 6, NULL,
 'Upload any other relevant supporting documents (optional).');
