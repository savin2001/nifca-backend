// Quick test script to generate a sample PDF with the new brand colors
const path = require("path");
const pdfGeneratorService = require("../services/pdfGeneratorService");

const mockApplication = {
  id: 99,
  reference_number: "NIFCA-2026-00043",
  status: "submitted",
  submitted_at: new Date("2026-02-18T10:30:00Z"),
  completion_percentage: 100,
  created_at: new Date("2026-02-10T08:00:00Z"),
  client: {
    username: "Acme Financial Holdings Ltd",
    email: "apply@acmefinancial.co.ke",
  },
  applicationType: {
    name: "NIFC Firm Certification",
  },
  sections: [
    {
      id: 1,
      name: "Declaration",
      section_order: 1,
      fields: [
        { id: 1, field_name: "declaration_authority", field_label: "I confirm that I have the authority to sign and submit this application on behalf of the applicant.", field_type: "checkbox" },
        { id: 2, field_name: "declaration_accuracy", field_label: "I declare that, to the best of my knowledge, the information provided in this form is true, complete, and accurate.", field_type: "checkbox" },
        { id: 3, field_name: "declaration_additional_info", field_label: "I confirm my understanding that the NIFC Authority may request more detailed information.", field_type: "checkbox" },
        { id: 4, field_name: "declaration_data_use", field_label: "I understand that any data provided to the NIFC Authority will be used for regulatory purposes.", field_type: "checkbox" },
        { id: 5, field_name: "declarant_name", field_label: "Full Name of Declarant", field_type: "text" },
        { id: 6, field_name: "declarant_position", field_label: "Position / Title", field_type: "text" },
        { id: 7, field_name: "declaration_date", field_label: "Date", field_type: "date" },
      ],
    },
    {
      id: 2,
      name: "Part 1 — General Information",
      section_order: 2,
      fields: [
        { id: 8, field_name: "company_name", field_label: "Company Name", field_type: "text" },
        { id: 9, field_name: "date_of_incorporation", field_label: "Date of Incorporation", field_type: "date" },
        { id: 10, field_name: "registration_number", field_label: "Business Registration Number", field_type: "text" },
        { id: 11, field_name: "country_of_incorporation", field_label: "Country of Incorporation", field_type: "select" },
        { id: 12, field_name: "registered_address", field_label: "Registered Office Address", field_type: "textarea" },
        { id: 13, field_name: "telephone_number", field_label: "Telephone Number", field_type: "text" },
        { id: 14, field_name: "email_address", field_label: "Email Address", field_type: "email" },
        { id: 15, field_name: "principal_activities", field_label: "Principal Activities (Current and Proposed)", field_type: "textarea" },
        { id: 16, field_name: "proposed_structure", field_label: "Proposed Structure", field_type: "select" },
        { id: 17, field_name: "regulatory_licence", field_label: "Does the applicant require a licence from any regulator in Kenya?", field_type: "textarea" },
        { id: 18, field_name: "financial_year_period", field_label: "Financial Year Period", field_type: "text" },
      ],
    },
    {
      id: 3,
      name: "Part 2 — Contact Information",
      section_order: 3,
      fields: [
        { id: 19, field_name: "contact_person_name", field_label: "Contact Person — Full Name", field_type: "text" },
        { id: 20, field_name: "contact_person_phone", field_label: "Contact Person — Telephone", field_type: "text" },
        { id: 21, field_name: "contact_person_email", field_label: "Contact Person — Email Address", field_type: "email" },
        { id: 22, field_name: "contact_person_address", field_label: "Contact Person — Postal Address", field_type: "textarea" },
        { id: 23, field_name: "senior_executive_name", field_label: "Senior Executive (e.g. CEO) — Full Name", field_type: "text" },
        { id: 24, field_name: "senior_executive_phone", field_label: "Senior Executive — Telephone", field_type: "text" },
        { id: 25, field_name: "senior_executive_email", field_label: "Senior Executive — Email Address", field_type: "email" },
        { id: 26, field_name: "senior_executive_address", field_label: "Senior Executive — Postal Address", field_type: "textarea" },
        { id: 27, field_name: "professional_adviser_name", field_label: "Professional Adviser — Full Name", field_type: "text" },
        { id: 28, field_name: "professional_adviser_phone", field_label: "Professional Adviser — Telephone", field_type: "text" },
        { id: 29, field_name: "professional_adviser_email", field_label: "Professional Adviser — Email Address", field_type: "email" },
        { id: 30, field_name: "professional_adviser_address", field_label: "Professional Adviser — Postal Address", field_type: "textarea" },
        { id: 31, field_name: "copy_adviser_correspondence", field_label: "Copy adviser on future correspondence?", field_type: "radio" },
      ],
    },
    {
      id: 4,
      name: "Part 3 — Group Structure, Controllers & Funding",
      section_order: 4,
      fields: [
        { id: 32, field_name: "group_membership", field_label: "Is the applicant a member of a group?", field_type: "textarea" },
        { id: 33, field_name: "parent_company_regulated", field_label: "Is the parent or holding company regulated?", field_type: "textarea" },
        { id: 34, field_name: "consolidated_supervision", field_label: "Subject to consolidated supervision?", field_type: "textarea" },
        { id: 35, field_name: "parent_company_details", field_label: "Parent company details", field_type: "textarea" },
        { id: 36, field_name: "parent_listed_exchange", field_label: "Parent listed on stock exchange?", field_type: "textarea" },
        { id: 37, field_name: "ownership_details", field_label: "Ownership details", field_type: "textarea" },
        { id: 38, field_name: "board_of_directors", field_label: "Board of directors", field_type: "textarea" },
        { id: 39, field_name: "senior_management", field_label: "Senior executive management", field_type: "textarea" },
      ],
    },
    {
      id: 5,
      name: "Part 4 — Operations in the NIFC",
      section_order: 5,
      fields: [
        { id: 40, field_name: "years_operational", field_label: "How long operational?", field_type: "text" },
        { id: 41, field_name: "business_transfer", field_label: "Business transferred?", field_type: "textarea" },
        { id: 42, field_name: "expected_client_base", field_label: "Expected client base", field_type: "textarea" },
        { id: 43, field_name: "products_services", field_label: "Products or services", field_type: "textarea" },
        { id: 44, field_name: "third_party_products", field_label: "Third-party products?", field_type: "textarea" },
        { id: 45, field_name: "risk_management", field_label: "Risk management", field_type: "textarea" },
        { id: 46, field_name: "internal_auditing", field_label: "Internal auditing", field_type: "textarea" },
        { id: 47, field_name: "indemnity_insurance", field_label: "Professional indemnity insurance?", field_type: "textarea" },
        { id: 48, field_name: "cyber_security_plan", field_label: "Cyber security plan?", field_type: "textarea" },
        { id: 49, field_name: "third_party_providers", field_label: "Third-party service providers?", field_type: "textarea" },
        { id: 50, field_name: "external_auditor", field_label: "External auditor", field_type: "textarea" },
        { id: 51, field_name: "organisation_size", field_label: "Organisation size and structure", field_type: "textarea" },
        { id: 52, field_name: "client_money", field_label: "Client money or investments?", field_type: "textarea" },
        { id: 53, field_name: "retail_complaints", field_label: "Retail customers and complaints?", field_type: "textarea" },
        { id: 54, field_name: "record_keeping", field_label: "Record keeping and data protection", field_type: "textarea" },
        { id: 55, field_name: "pending_investigations", field_label: "Pending investigations?", field_type: "textarea" },
        { id: 56, field_name: "past_disciplinary", field_label: "Past disciplinary actions?", field_type: "textarea" },
        { id: 57, field_name: "aml_policies", field_label: "AML policies", field_type: "textarea" },
      ],
    },
    {
      id: 6,
      name: "Part 5 — Business Plan",
      section_order: 6,
      fields: [
        { id: 58, field_name: "performance_track_record", field_label: "Performance and track record", field_type: "textarea" },
        { id: 59, field_name: "economic_contribution", field_label: "Economic contribution", field_type: "textarea" },
        { id: 60, field_name: "business_plan_kenya", field_label: "Business plan for Kenya/region", field_type: "textarea" },
        { id: 61, field_name: "innovation_expertise", field_label: "Innovation and expertise", field_type: "textarea" },
        { id: 62, field_name: "environmental_social_impact", field_label: "Environmental and social impact", field_type: "textarea" },
      ],
    },
    {
      id: 7,
      name: "Supporting Documents",
      section_order: 7,
      fields: [
        { id: 63, field_name: "business_plan_doc", field_label: "Business Plan", field_type: "file" },
        { id: 64, field_name: "certificate_of_incorporation", field_label: "Certificate of Incorporation", field_type: "file" },
        { id: 65, field_name: "group_structure_doc", field_label: "Group Structure Documentation", field_type: "file" },
        { id: 66, field_name: "board_executive_resumes", field_label: "Resumes of Board / Executive Members", field_type: "file" },
        { id: 67, field_name: "audited_accounts", field_label: "Latest Audited Accounts", field_type: "file" },
        { id: 68, field_name: "additional_documents", field_label: "Additional Supporting Documents", field_type: "file" },
      ],
    },
  ],
};

const mockSectionData = [
  {
    section_id: 1,
    field_data: {
      declaration_authority: ["agreed"],
      declaration_accuracy: ["agreed"],
      declaration_additional_info: ["agreed"],
      declaration_data_use: ["agreed"],
      declarant_name: "Sarah N. Kimani",
      declarant_position: "Chief Executive Officer",
      declaration_date: "2026-02-18",
    },
  },
  {
    section_id: 2,
    field_data: {
      company_name: "Acme Financial Holdings Ltd (trading as Acme Finance)",
      date_of_incorporation: "2019-03-15",
      registration_number: "PVT-2024-08832",
      country_of_incorporation: "Kenya",
      registered_address:
        "14th Floor, The Mirage Tower\nWaiyaki Way, Westlands\nP.O. Box 45201-00100\nNairobi, Kenya",
      telephone_number: "+254 720 123 456",
      email_address: "info@acmefinancial.co.ke",
      principal_activities:
        "Acme Financial Holdings is a diversified fund management company specialising in East African equities, fixed income securities, and alternative investments. The firm proposes to establish fund management operations within the NIFC to serve international institutional investors.",
      proposed_structure: "Subsidiary",
      regulatory_licence:
        "Yes — the applicant currently holds a Fund Manager licence issued by the Capital Markets Authority of Kenya (licence no. CMA/FM/2020-0045).",
      financial_year_period: "1 January – 31 December",
    },
  },
  {
    section_id: 3,
    field_data: {
      contact_person_name: "James L. Otieno",
      contact_person_phone: "+254 722 987 654",
      contact_person_email: "j.otieno@acmefinancial.co.ke",
      contact_person_address: "P.O. Box 45201-00100, Nairobi",
      senior_executive_name: "Sarah N. Kimani",
      senior_executive_phone: "+254 720 123 456",
      senior_executive_email: "s.kimani@acmefinancial.co.ke",
      senior_executive_address: "P.O. Box 45201-00100, Nairobi",
      professional_adviser_name: "Mbeki & Associates LLP",
      professional_adviser_phone: "+254 20 555 1234",
      professional_adviser_email: "nifca@mbeki-law.co.ke",
      professional_adviser_address: "P.O. Box 12345-00100, Nairobi",
      copy_adviser_correspondence: "yes",
    },
  },
  {
    section_id: 4,
    field_data: {
      group_membership:
        "Yes. Acme Financial Holdings Ltd is a wholly-owned subsidiary of Acme Group PLC, a diversified financial services group headquartered in Nairobi.",
      parent_company_regulated:
        "Yes — Acme Group PLC is regulated by the Capital Markets Authority of Kenya as a listed holding company.",
      consolidated_supervision:
        "Yes — Acme Group PLC is subject to consolidated supervision by the Capital Markets Authority of Kenya.",
      parent_company_details:
        "Acme Group PLC\nRegistration No: PLC-2015-00234\nContact: +254 20 444 5678\nAddress: Acme Tower, Kenyatta Avenue, Nairobi\nHolding: 100%\nLegal Designation: Public Limited Company",
      parent_listed_exchange: "Yes — Nairobi Securities Exchange (NSE), ticker: ACME.",
      ownership_details:
        "Acme Group PLC: 100%\nUltimate beneficial owners:\n- Dr. Peter K. Odhiambo (35%)\n- Kimani Family Trust (25%)\n- Public float (40%)",
      board_of_directors:
        "1. Dr. Peter K. Odhiambo — Chairperson (Independent Non-Executive Director), Kenyan, appointed 2019\n2. Sarah N. Kimani — Chief Executive Officer, Kenyan, appointed 2019\n3. Michael T. Mwangi — Chief Financial Officer, Kenyan, appointed 2020\n4. Aisha R. Hassan — Non-Executive Director, Kenyan, appointed 2021\n5. James L. Otieno — Non-Executive Director, Kenyan, appointed 2021\n6. Dr. Grace W. Njoroge — Independent Non-Executive Director, Kenyan, appointed 2022",
      senior_management:
        "1. Sarah N. Kimani — CEO, MBA (Strathmore), CFA\n2. Michael T. Mwangi — CFO, ACCA, CPA(K)\n3. Jane M. Wanjiru — Chief Compliance Officer, LLB, ACAMS\n4. David O. Kamau — Chief Investment Officer, MSc Finance, CFA",
    },
  },
  {
    section_id: 5,
    field_data: {
      years_operational: "7 years (since March 2019)",
      business_transfer: "No.",
      expected_client_base:
        "Primarily professional and institutional clients — pension funds, insurance companies, sovereign wealth entities, and family offices across East Africa, the Middle East, and Southeast Asia.",
      products_services:
        "1. Discretionary fund management (equities and fixed income)\n2. Alternative investment funds (private equity, infrastructure)\n3. Advisory services for institutional portfolios\n4. Bespoke wealth management solutions",
      third_party_products: "No — all products are developed and managed in-house.",
      risk_management:
        "Yes. Jane M. Wanjiru serves as the designated Risk Management Specialist. The firm operates a three-lines-of-defence model with an enterprise risk management framework reviewed quarterly by the Board Risk Committee.",
      internal_auditing:
        "Internal audits are conducted quarterly by KPMG East Africa under a co-sourced arrangement. The Head of Internal Audit reports directly to the Board Audit Committee.",
      indemnity_insurance:
        "Yes — professional indemnity insurance with AIG Kenya, coverage of KES 500 million per claim.",
      cyber_security_plan:
        "Yes. The firm maintains a comprehensive cyber security framework based on the NIST Cybersecurity Framework, including incident response, penetration testing (quarterly), and mandatory staff training.",
      third_party_providers:
        "1. IT infrastructure — Dimension Data (managed cloud services)\n2. Custodian services — Standard Chartered Bank Kenya\n3. Fund administration — Apex Group (Mauritius)",
      external_auditor:
        "PricewaterhouseCoopers (PwC) Kenya\nLead Partner: John A. Muthama\nAddress: PwC Tower, Waiyaki Way, Nairobi",
      organisation_size:
        "Currently 85 employees. The NIFC subsidiary is expected to have 25 employees across four departments: Investment Management, Risk & Compliance, Operations, and Corporate Services.",
      client_money:
        "Yes — client money will be held in segregated accounts at Standard Chartered Bank Kenya, in accordance with NIFC Authority safeguarding requirements.",
      retail_complaints:
        "The applicant does not currently serve retail customers within the NIFC. However, a formal complaints handling procedure has been established in line with best practice, should retail activities be approved in future.",
      record_keeping:
        "All records are maintained electronically using a certified document management system (OpenText) with a minimum retention period of 10 years. Data protection policies comply with the Kenya Data Protection Act 2019.",
      pending_investigations: "No.",
      past_disciplinary: "No.",
      aml_policies:
        "The firm maintains a comprehensive AML/CFT framework compliant with the Proceeds of Crime and Anti-Money Laundering Act (Cap 59B). Customer due diligence (CDD) is performed at onboarding with enhanced due diligence for PEPs. Suspicious activity reports are filed with the Financial Reporting Centre within statutory timelines. The MLRO is Jane M. Wanjiru.",
    },
  },
  {
    section_id: 6,
    field_data: {
      performance_track_record:
        "FY 2023: AUM KES 12.4 billion, net revenue KES 1.8 billion, ROE 18%.\nFY 2024: AUM KES 15.1 billion, net revenue KES 2.2 billion, ROE 20%.\nFY 2025: AUM KES 18.7 billion, net revenue KES 2.45 billion, ROE 19%.\nConsistently ranked top-3 fund manager by the CMA annual survey.",
      economic_contribution:
        "The NIFC subsidiary is expected to create 25 direct jobs and support an additional 40 indirect jobs through service providers. Projected annual tax contribution of KES 120 million within three years. The firm will contribute to deepening Kenya's capital markets by attracting international institutional capital.",
      business_plan_kenya:
        "Short-term (Year 1): Establish the NIFC subsidiary, recruit key personnel, and onboard 5 institutional clients.\nMedium-term (Years 2–3): Scale AUM to KES 5 billion within the NIFC, launch two new fund products targeting Gulf and SE Asian investors.\nLong-term (Years 4–5): Position the NIFC subsidiary as the regional hub for cross-border fund management, targeting KES 15 billion AUM.",
      innovation_expertise:
        "The firm has developed a proprietary quantitative risk model (AcmeRisk™) that combines fundamental analysis with machine-learning-driven factor models. This is complemented by a 15-year track record in East African frontier markets, a segment under-served by global managers.",
      environmental_social_impact:
        "The firm has adopted the UN Principles for Responsible Investment (UNPRI) and integrates ESG criteria into all investment decisions. 10% of AUM is allocated to a dedicated impact fund targeting renewable energy and affordable housing in East Africa.",
    },
  },
];

const mockDocuments = [
  {
    id: 1,
    document_type: "business_plan_doc",
    original_filename: "Acme_NIFC_Business_Plan_2026.pdf",
    file_size: 2345678,
    uploaded_at: new Date("2026-02-14T16:45:00Z"),
  },
  {
    id: 2,
    document_type: "certificate_of_incorporation",
    original_filename: "Acme_Certificate_of_Incorporation.pdf",
    file_size: 1245678,
    uploaded_at: new Date("2026-02-12T14:30:00Z"),
  },
  {
    id: 3,
    document_type: "board_executive_resumes",
    original_filename: "Acme_Board_Executive_CVs.pdf",
    file_size: 3456789,
    uploaded_at: new Date("2026-02-13T11:00:00Z"),
  },
  {
    id: 4,
    document_type: "audited_accounts",
    original_filename: "Acme_Audited_Financials_2025.pdf",
    file_size: 4567890,
    uploaded_at: new Date("2026-02-13T09:15:00Z"),
  },
  {
    id: 5,
    document_type: "group_structure_doc",
    original_filename: "Acme_Group_Structure_Chart.pdf",
    file_size: 876543,
    uploaded_at: new Date("2026-02-15T11:20:00Z"),
  },
];

(async () => {
  try {
    console.log("Generating test PDF with brand colors...");
    const resultPath = await pdfGeneratorService.generateApplicationPdf(
      mockApplication,
      mockSectionData,
      mockDocuments
    );
    const fullPath = path.join(__dirname, "..", resultPath);
    console.log("PDF generated successfully!");
    console.log("Path:", fullPath);
  } catch (err) {
    console.error("Error generating PDF:", err);
    process.exit(1);
  }
})();
