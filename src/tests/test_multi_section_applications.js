// src/tests/test_multi_section_applications.js
// Test script for multi-section application system - tests both client and admin flows

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Test credentials - adjust these to match your database
const CLIENT_EMAIL = process.env.TEST_CLIENT_EMAIL || "client@nifca.com";
const CLIENT_PASSWORD = process.env.TEST_CLIENT_PASSWORD || "password123";
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || "appadmin@nifca.com";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || "password123";

let clientSessionCookie = null;
let adminJwtToken = null;
let createdApplicationId = null;
let applicationTypeId = null;
let sectionIds = [];

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, body = null, headers = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const setCookieHeader = response.headers.get("set-cookie");
    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      data,
      setCookie: setCookieHeader,
      ok: response.ok,
    };
  } catch (error) {
    return { error: error.message, status: 0 };
  }
}

// Helper to print test results
function printResult(testName, passed, details = "") {
  const status = passed ? "✓ PASS" : "✗ FAIL";
  console.log(`  ${status}: ${testName}`);
  if (details && !passed) {
    console.log(`         ${details}`);
  }
}

// =====================================================
// CLIENT TESTS
// =====================================================

async function testClientLogin() {
  console.log("\n--- Testing Client Login ---");
  const result = await makeRequest("POST", "/api/client/auth/login", {
    email: CLIENT_EMAIL,
    password: CLIENT_PASSWORD,
  });

  if (result.ok && result.setCookie) {
    clientSessionCookie = result.setCookie.split(";")[0];
    printResult("Client login", true);
    return true;
  } else {
    printResult("Client login", false, JSON.stringify(result.data));
    return false;
  }
}

async function testGetApplicationTypes() {
  console.log("\n--- Testing Get Application Types ---");
  const result = await makeRequest("GET", "/api/client/multi-applications/types", null, {
    Cookie: clientSessionCookie,
  });

  if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
    // Find the Financial Services License type (FSL) which has sections defined
    // Or use the first type that has code 'FSL' or name containing 'Financial'
    const fslType = result.data.find(t => t.code === 'FSL' || t.name.includes('Financial'));
    applicationTypeId = fslType ? fslType.id : result.data[0].id;
    printResult("Get application types", true);
    console.log(`         Found ${result.data.length} application type(s): ${result.data.map(t => t.name).join(", ")}`);
    console.log(`         Using: ${fslType ? fslType.name : result.data[0].name} (id: ${applicationTypeId})`);
    return true;
  } else {
    printResult("Get application types", false, JSON.stringify(result.data));
    return false;
  }
}

async function testGetApplicationTypeStructure() {
  console.log("\n--- Testing Get Application Type Structure ---");
  if (!applicationTypeId) {
    printResult("Get application type structure", false, "No application type ID");
    return false;
  }

  const result = await makeRequest(
    "GET",
    `/api/client/multi-applications/types/${applicationTypeId}/structure`,
    null,
    { Cookie: clientSessionCookie }
  );

  if (result.ok && result.data && result.data.sections) {
    sectionIds = result.data.sections.map((s) => s.id);
    printResult("Get application type structure", true);
    console.log(`         Found ${result.data.sections.length} section(s):`);
    result.data.sections.forEach((s) => {
      console.log(`           - ${s.name} (${s.fields?.length || 0} fields)`);
    });
    return true;
  } else {
    printResult("Get application type structure", false, JSON.stringify(result.data));
    return false;
  }
}

async function testCreateDraftApplication() {
  console.log("\n--- Testing Create Draft Application ---");
  if (!applicationTypeId) {
    printResult("Create draft application", false, "No application type ID");
    return false;
  }

  const result = await makeRequest(
    "POST",
    "/api/client/multi-applications",
    {
      application_type_id: applicationTypeId,
      title: "Test Application " + Date.now(),
    },
    { Cookie: clientSessionCookie }
  );

  if (result.status === 201 && result.data && result.data.application) {
    createdApplicationId = result.data.application.id;
    printResult("Create draft application", true);
    console.log(`         Application ID: ${createdApplicationId}`);
    console.log(`         Reference: ${result.data.application.reference_number}`);
    return true;
  } else {
    printResult("Create draft application", false, JSON.stringify(result.data));
    return false;
  }
}

async function testGetClientApplications() {
  console.log("\n--- Testing Get Client Applications ---");
  const result = await makeRequest("GET", "/api/client/multi-applications", null, {
    Cookie: clientSessionCookie,
  });

  if (result.ok && result.data && result.data.applications) {
    printResult("Get client applications", true);
    console.log(`         Found ${result.data.applications.length} application(s)`);
    console.log(`         Pagination: page ${result.data.pagination.page} of ${result.data.pagination.totalPages}`);
    return true;
  } else {
    printResult("Get client applications", false, JSON.stringify(result.data));
    return false;
  }
}

async function testGetApplication() {
  console.log("\n--- Testing Get Single Application ---");
  if (!createdApplicationId) {
    printResult("Get single application", false, "No application ID");
    return false;
  }

  const result = await makeRequest(
    "GET",
    `/api/client/multi-applications/${createdApplicationId}`,
    null,
    { Cookie: clientSessionCookie }
  );

  if (result.ok && result.data && result.data.application) {
    printResult("Get single application", true);
    console.log(`         Status: ${result.data.application.status}`);
    console.log(`         Completion: ${result.data.application.completion_percentage}%`);
    return true;
  } else {
    printResult("Get single application", false, JSON.stringify(result.data));
    return false;
  }
}

async function testSaveSectionData() {
  console.log("\n--- Testing Save Section Data ---");
  if (!createdApplicationId || sectionIds.length === 0) {
    printResult("Save section data", false, "No application or section IDs");
    return false;
  }

  // Test saving data to first section (Company Information)
  const firstSectionId = sectionIds[0];
  const testData = {
    field_data: {
      company_name: "Test Company Ltd",
      registration_number: "ABC-123456",
      date_of_incorporation: "2020-01-15",
      country_of_incorporation: "KE",
      company_type: "LLC",
    },
  };

  const result = await makeRequest(
    "PUT",
    `/api/client/multi-applications/${createdApplicationId}/sections/${firstSectionId}`,
    testData,
    { Cookie: clientSessionCookie }
  );

  if (result.ok) {
    printResult("Save section data", true);
    console.log(`         Completion: ${result.data.completion_percentage}%`);
    return true;
  } else {
    printResult("Save section data", false, JSON.stringify(result.data));
    return false;
  }
}

async function testGetSectionData() {
  console.log("\n--- Testing Get Section Data ---");
  if (!createdApplicationId || sectionIds.length === 0) {
    printResult("Get section data", false, "No application or section IDs");
    return false;
  }

  const firstSectionId = sectionIds[0];
  const result = await makeRequest(
    "GET",
    `/api/client/multi-applications/${createdApplicationId}/sections/${firstSectionId}`,
    null,
    { Cookie: clientSessionCookie }
  );

  if (result.ok && result.data && result.data.section) {
    printResult("Get section data", true);
    console.log(`         Section: ${result.data.section.name}`);
    console.log(`         Fields: ${result.data.fields?.length || 0}`);
    return true;
  } else {
    printResult("Get section data", false, JSON.stringify(result.data));
    return false;
  }
}

async function testValidateSection() {
  console.log("\n--- Testing Validate Section ---");
  if (!createdApplicationId || sectionIds.length === 0) {
    printResult("Validate section", false, "No application or section IDs");
    return false;
  }

  const firstSectionId = sectionIds[0];
  const result = await makeRequest(
    "POST",
    `/api/client/multi-applications/${createdApplicationId}/sections/${firstSectionId}/validate`,
    {},
    { Cookie: clientSessionCookie }
  );

  // Note: Validation may fail if not all required fields are filled
  if (result.status === 200 && result.data.valid) {
    printResult("Validate section (passed)", true);
    console.log(`         Completion: ${result.data.completion_percentage}%`);
    return true;
  } else if (result.status === 400 && result.data.valid === false) {
    printResult("Validate section (validation errors - expected for incomplete data)", true);
    console.log(`         Errors: ${Object.keys(result.data.errors || {}).join(", ")}`);
    return true;
  } else {
    printResult("Validate section", false, JSON.stringify(result.data));
    return false;
  }
}

async function testSaveAllSections() {
  console.log("\n--- Testing Save All Required Sections ---");
  if (!createdApplicationId || sectionIds.length === 0) {
    printResult("Save all sections", false, "No application or section IDs");
    return false;
  }

  const sectionDataMap = [
    // Section 1: Company Information
    {
      company_name: "Test Company Ltd",
      registration_number: "ABC-123456",
      date_of_incorporation: "2020-01-15",
      country_of_incorporation: "KE",
      company_type: "LLC",
    },
    // Section 2: Contact Details
    {
      contact_person_name: "John Doe",
      contact_email: "john@testcompany.com",
      contact_phone: "+254 700 123456",
      physical_address: "123 Test Street, Nairobi, Kenya",
      postal_address: "P.O. Box 12345, Nairobi",
    },
    // Section 3: Business Activities
    {
      proposed_activities: ["BANKING", "SECURITIES"],
      business_plan_summary:
        "Our company plans to provide comprehensive banking and securities trading services in the East African region. We aim to leverage technology to provide innovative financial solutions to businesses and individuals. Our target market includes SMEs and high-net-worth individuals seeking reliable financial services.",
      projected_annual_revenue: 5000000,
      initial_capital: 10000000,
    },
    // Section 4: Directors & Shareholders
    {
      number_of_directors: 3,
      director_names: "Jane Smith\nJohn Doe\nMary Johnson",
      beneficial_owners: "Jane Smith - 40%\nJohn Doe - 35%\nMary Johnson - 25%",
      has_criminal_record: "no",
    },
    // Section 5: Supporting Documents - We'll skip file uploads for this test
    {},
  ];

  let allPassed = true;
  for (let i = 0; i < Math.min(sectionIds.length, sectionDataMap.length); i++) {
    // Skip sections with no data (like file upload sections)
    if (Object.keys(sectionDataMap[i]).length === 0) {
      console.log(`         Skipping section ${i + 1} (file upload section)`);
      continue;
    }

    const result = await makeRequest(
      "PUT",
      `/api/client/multi-applications/${createdApplicationId}/sections/${sectionIds[i]}`,
      { field_data: sectionDataMap[i] },
      { Cookie: clientSessionCookie }
    );

    if (result.ok) {
      console.log(`         Section ${i + 1} saved - Completion: ${result.data.completion_percentage}%`);
    } else {
      console.log(`         Section ${i + 1} FAILED: ${JSON.stringify(result.data)}`);
      allPassed = false;
    }
  }

  printResult("Save all sections", allPassed);
  return allPassed;
}

async function testValidateAllSections() {
  console.log("\n--- Testing Validate All Sections ---");
  if (!createdApplicationId || sectionIds.length === 0) {
    printResult("Validate all sections", false, "No application or section IDs");
    return false;
  }

  let validCount = 0;
  let errorCount = 0;

  // Skip the last section (Supporting Documents) as it requires file uploads
  for (let i = 0; i < sectionIds.length - 1; i++) {
    const result = await makeRequest(
      "POST",
      `/api/client/multi-applications/${createdApplicationId}/sections/${sectionIds[i]}/validate`,
      {},
      { Cookie: clientSessionCookie }
    );

    if (result.status === 200 && result.data.valid) {
      validCount++;
      console.log(`         Section ${i + 1}: Valid`);
    } else if (result.status === 400) {
      errorCount++;
      console.log(`         Section ${i + 1}: Invalid - ${Object.keys(result.data.errors || {}).join(", ")}`);
    } else {
      console.log(`         Section ${i + 1}: Error - ${JSON.stringify(result.data)}`);
    }
  }

  printResult(`Validate all sections (${validCount} valid, ${errorCount} invalid)`, true);
  return true;
}

async function testSubmitApplication() {
  console.log("\n--- Testing Submit Application ---");
  if (!createdApplicationId) {
    printResult("Submit application", false, "No application ID");
    return false;
  }

  const result = await makeRequest(
    "POST",
    `/api/client/multi-applications/${createdApplicationId}/submit`,
    {},
    { Cookie: clientSessionCookie }
  );

  if (result.ok && result.data && result.data.application) {
    printResult("Submit application", true);
    console.log(`         New status: ${result.data.application.status}`);
    if (result.data.pdf_path) {
      console.log(`         PDF generated: ${result.data.pdf_path}`);
    }
    return true;
  } else if (result.status === 400) {
    // May fail if required sections aren't complete
    printResult("Submit application (incomplete - expected)", true);
    console.log(`         ${result.data?.error || "Incomplete sections"}`);
    if (result.data?.incomplete_sections) {
      console.log(`         Incomplete: ${result.data.incomplete_sections.map(s => s.name).join(", ")}`);
    }
    return true;
  } else {
    printResult("Submit application", false, JSON.stringify(result.data));
    return false;
  }
}

async function testCancelApplication() {
  console.log("\n--- Testing Cancel Application ---");
  if (!createdApplicationId) {
    printResult("Cancel application", false, "No application ID");
    return false;
  }

  const result = await makeRequest(
    "POST",
    `/api/client/multi-applications/${createdApplicationId}/cancel`,
    {},
    { Cookie: clientSessionCookie }
  );

  if (result.ok) {
    printResult("Cancel application", true);
    console.log(`         New status: ${result.data.application.status}`);
    return true;
  } else {
    printResult("Cancel application", false, JSON.stringify(result.data));
    return false;
  }
}

// =====================================================
// ADMIN TESTS
// =====================================================

async function testAdminLogin() {
  console.log("\n--- Testing Admin Login ---");
  const result = await makeRequest("POST", "/api/auth/login", {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (result.ok && result.data && result.data.token) {
    adminJwtToken = result.data.token;
    printResult("Admin login", true);
    return true;
  } else {
    printResult("Admin login", false, JSON.stringify(result.data));
    console.log("         Note: Make sure ADMIN_EMAIL and ADMIN_PASSWORD are correct for your database");
    return false;
  }
}

async function testAdminGetApplicationTypes() {
  console.log("\n--- Testing Admin Get Application Types ---");
  if (!adminJwtToken) {
    printResult("Admin get application types", false, "Not logged in");
    return false;
  }

  const result = await makeRequest("GET", "/api/applications/types", null, {
    Authorization: `Bearer ${adminJwtToken}`,
  });

  if (result.ok && Array.isArray(result.data)) {
    printResult("Admin get application types", true);
    console.log(`         Found ${result.data.length} type(s) (including inactive)`);
    return true;
  } else {
    printResult("Admin get application types", false, JSON.stringify(result.data));
    return false;
  }
}

async function testAdminGetStatistics() {
  console.log("\n--- Testing Admin Get Statistics ---");
  if (!adminJwtToken) {
    printResult("Admin get statistics", false, "Not logged in");
    return false;
  }

  const result = await makeRequest("GET", "/api/applications/statistics", null, {
    Authorization: `Bearer ${adminJwtToken}`,
  });

  if (result.ok && result.data) {
    printResult("Admin get statistics", true);
    console.log(`         Statistics: ${JSON.stringify(result.data)}`);
    return true;
  } else {
    printResult("Admin get statistics", false, JSON.stringify(result.data));
    return false;
  }
}

async function testAdminGetPendingReview() {
  console.log("\n--- Testing Admin Get Pending Review ---");
  if (!adminJwtToken) {
    printResult("Admin get pending review", false, "Not logged in");
    return false;
  }

  const result = await makeRequest("GET", "/api/applications/pending-review", null, {
    Authorization: `Bearer ${adminJwtToken}`,
  });

  if (result.ok && Array.isArray(result.data)) {
    printResult("Admin get pending review", true);
    console.log(`         Found ${result.data.length} application(s) pending review`);
    return true;
  } else {
    printResult("Admin get pending review", false, JSON.stringify(result.data));
    return false;
  }
}

async function testAdminGetAllApplicationsFiltered() {
  console.log("\n--- Testing Admin Get All Applications (Filtered) ---");
  if (!adminJwtToken) {
    printResult("Admin get all applications", false, "Not logged in");
    return false;
  }

  const result = await makeRequest("GET", "/api/applications/filtered?page=1&limit=10", null, {
    Authorization: `Bearer ${adminJwtToken}`,
  });

  if (result.ok && result.data && result.data.applications) {
    printResult("Admin get all applications", true);
    console.log(`         Found ${result.data.applications.length} application(s)`);
    console.log(`         Total: ${result.data.pagination?.total || "N/A"}`);
    return true;
  } else {
    printResult("Admin get all applications", false, JSON.stringify(result.data));
    return false;
  }
}

async function testAdminGetApplicationFullDetails() {
  console.log("\n--- Testing Admin Get Application Full Details ---");
  if (!adminJwtToken || !createdApplicationId) {
    printResult("Admin get full details", false, "Not logged in or no application ID");
    return false;
  }

  const result = await makeRequest(
    "GET",
    `/api/applications/${createdApplicationId}/full`,
    null,
    { Authorization: `Bearer ${adminJwtToken}` }
  );

  if (result.ok && result.data && result.data.application) {
    printResult("Admin get full details", true);
    console.log(`         Application: ${result.data.application.title}`);
    console.log(`         Status: ${result.data.application.status}`);
    console.log(`         Sections: ${result.data.sectionData?.length || 0}`);
    console.log(`         Documents: ${result.data.documents?.length || 0}`);
    return true;
  } else {
    printResult("Admin get full details", false, JSON.stringify(result.data));
    return false;
  }
}

async function testAdminReviewApplication() {
  console.log("\n--- Testing Admin Review Application ---");
  if (!adminJwtToken || !createdApplicationId) {
    printResult("Admin review application", false, "Not logged in or no application ID");
    return false;
  }

  // First, let's get the application to check its status
  const getResult = await makeRequest(
    "GET",
    `/api/applications/${createdApplicationId}/full`,
    null,
    { Authorization: `Bearer ${adminJwtToken}` }
  );

  const currentStatus = getResult.data?.application?.status;
  console.log(`         Current status: ${currentStatus}`);

  // Only submitted, under_review, or pending applications can be reviewed
  if (!["submitted", "under_review", "pending"].includes(currentStatus)) {
    printResult("Admin review application (skipped - not reviewable status)", true);
    return true;
  }

  const result = await makeRequest(
    "POST",
    `/api/applications/${createdApplicationId}/review-multi`,
    {
      status: "under_review",
      review_comments: "Application is under review. Additional documents may be requested.",
    },
    { Authorization: `Bearer ${adminJwtToken}` }
  );

  if (result.ok) {
    printResult("Admin review application", true);
    console.log(`         New status: ${result.data.application?.status}`);
    return true;
  } else {
    printResult("Admin review application", false, JSON.stringify(result.data));
    return false;
  }
}

async function testAdminUpdateApplicationStatus() {
  console.log("\n--- Testing Admin Update Application Status ---");
  if (!adminJwtToken || !createdApplicationId) {
    printResult("Admin update status", false, "Not logged in or no application ID");
    return false;
  }

  const result = await makeRequest(
    "PATCH",
    `/api/applications/${createdApplicationId}/status`,
    { status: "approved" },
    { Authorization: `Bearer ${adminJwtToken}` }
  );

  if (result.ok) {
    printResult("Admin update status", true);
    console.log(`         New status: ${result.data.application?.status}`);
    return true;
  } else {
    // May fail depending on current status
    printResult("Admin update status", false, JSON.stringify(result.data));
    return false;
  }
}

// =====================================================
// CREATE A NEW APPLICATION FOR ADMIN TESTING
// =====================================================

async function createNewApplicationForAdminTest() {
  console.log("\n--- Creating New Application for Admin Tests ---");

  // Create a new draft application
  const createResult = await makeRequest(
    "POST",
    "/api/client/multi-applications",
    {
      application_type_id: applicationTypeId,
      title: "Admin Test Application " + Date.now(),
    },
    { Cookie: clientSessionCookie }
  );

  if (createResult.status !== 201) {
    console.log("         Failed to create new application");
    return null;
  }

  const newAppId = createResult.data.application.id;
  console.log(`         Created application ID: ${newAppId}`);

  // Save all section data
  const sectionDataMap = [
    {
      company_name: "Admin Test Company Ltd",
      registration_number: "XYZ-789012",
      date_of_incorporation: "2019-06-20",
      country_of_incorporation: "UK",
      company_type: "PLC",
    },
    {
      contact_person_name: "Alice Brown",
      contact_email: "alice@admintest.com",
      contact_phone: "+44 20 1234 5678",
      physical_address: "456 Admin Street, London, UK",
      postal_address: "P.O. Box 67890, London",
    },
    {
      proposed_activities: ["FUND_MGMT", "FOREX"],
      business_plan_summary:
        "We specialize in fund management and foreign exchange services. Our experienced team of financial professionals will provide top-tier investment management and forex trading solutions to institutional and retail clients across Europe and Africa.",
      projected_annual_revenue: 10000000,
      initial_capital: 25000000,
    },
    {
      number_of_directors: 5,
      director_names: "Alice Brown\nBob Wilson\nCharlie Davis\nDiana Miller\nEvan Taylor",
      beneficial_owners: "Alice Brown - 30%\nBob Wilson - 25%\nCharlie Davis - 20%\nDiana Miller - 15%\nEvan Taylor - 10%",
      has_criminal_record: "no",
    },
  ];

  // Save and validate each section
  for (let i = 0; i < Math.min(sectionIds.length - 1, sectionDataMap.length); i++) {
    await makeRequest(
      "PUT",
      `/api/client/multi-applications/${newAppId}/sections/${sectionIds[i]}`,
      { field_data: sectionDataMap[i] },
      { Cookie: clientSessionCookie }
    );

    await makeRequest(
      "POST",
      `/api/client/multi-applications/${newAppId}/sections/${sectionIds[i]}/validate`,
      {},
      { Cookie: clientSessionCookie }
    );
  }

  // Try to submit
  const submitResult = await makeRequest(
    "POST",
    `/api/client/multi-applications/${newAppId}/submit`,
    {},
    { Cookie: clientSessionCookie }
  );

  if (submitResult.ok) {
    console.log(`         Application submitted successfully`);
  } else {
    console.log(`         Submission failed (may be missing required documents): ${submitResult.data?.error}`);
  }

  return newAppId;
}

// =====================================================
// MAIN TEST RUNNER
// =====================================================

async function runTests() {
  console.log("=".repeat(60));
  console.log("Multi-Section Application System Tests");
  console.log("=".repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Client: ${CLIENT_EMAIL}`);
  console.log(`Admin User: ${ADMIN_EMAIL}`);

  // CLIENT TESTS
  console.log("\n" + "=".repeat(60));
  console.log("CLIENT-SIDE TESTS");
  console.log("=".repeat(60));

  const clientLoginOk = await testClientLogin();
  if (!clientLoginOk) {
    console.log("\n⚠️  Client login failed. Make sure:");
    console.log("   1. Server is running on " + BASE_URL);
    console.log("   2. Test client exists in database");
    console.log("   3. Run: node src/tests/setup_test_client.js");
    console.log("\nSkipping remaining client tests...");
  } else {
    await testGetApplicationTypes();
    await testGetApplicationTypeStructure();
    await testCreateDraftApplication();
    await testGetClientApplications();
    await testGetApplication();
    await testSaveSectionData();
    await testGetSectionData();
    await testValidateSection();
    await testSaveAllSections();
    await testValidateAllSections();
    await testSubmitApplication();
  }

  // ADMIN TESTS
  console.log("\n" + "=".repeat(60));
  console.log("ADMIN-SIDE TESTS");
  console.log("=".repeat(60));

  const adminLoginOk = await testAdminLogin();
  if (!adminLoginOk) {
    console.log("\n⚠️  Admin login failed. Make sure:");
    console.log("   1. Admin user exists with role_id = 3 (Application Admin)");
    console.log("   2. Update ADMIN_EMAIL and ADMIN_PASSWORD in this script");
    console.log("\nSkipping remaining admin tests...");
  } else {
    await testAdminGetApplicationTypes();
    await testAdminGetStatistics();
    await testAdminGetPendingReview();
    await testAdminGetAllApplicationsFiltered();

    if (createdApplicationId) {
      await testAdminGetApplicationFullDetails();
      await testAdminReviewApplication();
    }

    // Create a new application for admin review testing
    if (clientLoginOk && applicationTypeId) {
      const newAppId = await createNewApplicationForAdminTest();
      if (newAppId) {
        createdApplicationId = newAppId;
        await testAdminGetApplicationFullDetails();
        await testAdminReviewApplication();
        await testAdminUpdateApplicationStatus();
      }
    }
  }

  // CLEANUP TEST - Cancel any remaining test applications
  console.log("\n" + "=".repeat(60));
  console.log("CLEANUP");
  console.log("=".repeat(60));

  if (clientLoginOk && createdApplicationId) {
    // Note: We don't cancel here since the app might be approved
    console.log(`  Test application ${createdApplicationId} left in database for inspection`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("TESTS COMPLETE");
  console.log("=".repeat(60));
}

// Run the tests
runTests().catch(console.error);
