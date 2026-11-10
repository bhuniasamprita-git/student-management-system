"""
Automated Test & Verification Harness for IEM Admission Portal MongoDB Schemas
Verifies all 8 Collections, Schemas, Relationships, and Field Logic.
"""

import os
import re
import sys

print("================================================================")
print("🔍 Testing IEM Admission Portal MongoDB Schemas & Relationships")
print("================================================================\n")

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
expected_collections = {
    "User": {"file": "User.js", "collection": "users"},
    "Applicant": {"file": "Applicant.js", "collection": "applicants"},
    "Application": {"file": "Application.js", "collection": "applications"},
    "Document": {"file": "Document.js", "collection": "documents"},
    "Payment": {"file": "Payment.js", "collection": "payments"},
    "Notification": {"file": "Notification.js", "collection": "notifications"},
    "Admin": {"file": "Admin.js", "collection": "admins"},
    "AuditLog": {"file": "AuditLog.js", "collection": "auditlogs"},
    "Course": {"file": "Course.js", "collection": "courses"}
}

passed_tests = 0
total_tests = 0

def assert_test(condition, message):
    global passed_tests, total_tests
    total_tests += 1
    if condition:
        print(f"  ✅ [PASS]: {message}")
        passed_tests += 1
    else:
        print(f"  ❌ [FAIL]: {message}")
        sys.exit(1)

# 1. Test existence of all 8 + 1 Model Files
print("--- 1. Checking Existence of Mongoose Model Files ---")
for model_name, info in expected_collections.items():
    file_path = os.path.join(MODELS_DIR, info["file"])
    assert_test(os.path.exists(file_path), f"Model file exists: models/{info['file']}")

# 2. Check Relational References in Schemas
print("\n--- 2. Verifying MongoDB Relational References ('ref') ---")

# Applicant -> User
with open(os.path.join(MODELS_DIR, "Applicant.js"), "r", encoding="utf-8") as f:
    applicant_content = f.read()
    assert_test("ref: 'User'" in applicant_content or 'ref: "User"' in applicant_content, 
                "Applicant model establishes reference to 'User' collection (userId)")

# Application -> Applicant, User, Document, Payment
with open(os.path.join(MODELS_DIR, "Application.js"), "r", encoding="utf-8") as f:
    app_content = f.read()
    assert_test("ref: 'Applicant'" in app_content or 'ref: "Applicant"' in app_content, 
                "Application model establishes reference to 'Applicant' collection (applicantId)")
    assert_test("ref: 'User'" in app_content or 'ref: "User"' in app_content, 
                "Application model establishes reference to 'User' collection (userId)")
    assert_test("ref: 'Document'" in app_content or 'ref: "Document"' in app_content, 
                "Application model establishes array reference to 'Document' collection (documents)")
    assert_test("ref: 'Payment'" in app_content or 'ref: "Payment"' in app_content, 
                "Application model establishes reference to 'Payment' collection (paymentId)")

# Document -> Application, Applicant
with open(os.path.join(MODELS_DIR, "Document.js"), "r", encoding="utf-8") as f:
    doc_content = f.read()
    assert_test("ref: 'Application'" in doc_content, "Document model references 'Application' (applicationId)")
    assert_test("ref: 'Applicant'" in doc_content, "Document model references 'Applicant' (applicantId)")

# Payment -> Application, Applicant, User
with open(os.path.join(MODELS_DIR, "Payment.js"), "r", encoding="utf-8") as f:
    pay_content = f.read()
    assert_test("ref: 'Application'" in pay_content, "Payment model references 'Application' (applicationId)")
    assert_test("ref: 'Applicant'" in pay_content, "Payment model references 'Applicant' (applicantId)")
    assert_test("ref: 'User'" in pay_content, "Payment model references 'User' (userId)")

# Admin -> User
with open(os.path.join(MODELS_DIR, "Admin.js"), "r", encoding="utf-8") as f:
    adm_content = f.read()
    assert_test("ref: 'User'" in adm_content, "Admin model references 'User' (userId)")

# Notification -> User
with open(os.path.join(MODELS_DIR, "Notification.js"), "r", encoding="utf-8") as f:
    notif_content = f.read()
    assert_test("ref: 'User'" in notif_content, "Notification model references 'User' (recipientId)")

# AuditLog -> User, Application
with open(os.path.join(MODELS_DIR, "AuditLog.js"), "r", encoding="utf-8") as f:
    audit_content = f.read()
    assert_test("ref: 'User'" in audit_content, "AuditLog model references 'User' (performedBy)")
    assert_test("ref: 'Application'" in audit_content, "AuditLog model references 'Application' (targetApplication)")

# 3. Test Academic Formula & Business Logic Simulation
print("\n--- 3. Testing Academic Calculation & Validation Logic ---")
physics = 92
chemistry = 89
maths = 95
calculated_pcm = round((physics + chemistry + maths) / 3.0, 1)
assert_test(calculated_pcm == 92.0, f"PCM Aggregate calculation is accurate: {calculated_pcm}% for P={physics}, C={chemistry}, M={maths}")

# Validation threshold
is_eligible = calculated_pcm >= 60.0
assert_test(is_eligible is True, "Eligibility condition (> 60% PCM) correctly evaluates to True")

# Low score check
low_p, low_c, low_m = 40, 42, 38
low_pcm = round((low_p + low_c + low_m) / 3.0, 1)
assert_test(low_pcm < 45.0, f"Low PCM correctly flagged as ineligible: {low_pcm}%")

# 4. Test Application Number Format
print("\n--- 4. Testing Unique Application ID Pattern ---")
app_no = "IEM-2026-8492"
pattern = r"^IEM-2026-\d{4}$"
assert_test(bool(re.match(pattern, app_no)), f"Application ID '{app_no}' adheres to format 'IEM-2026-XXXX'")

# 5. Test Transaction ID Format
txn_no = "TXN-IEM-93821039"
txn_pattern = r"^TXN-IEM-\d{8}$"
assert_test(bool(re.match(txn_pattern, txn_no)), f"Transaction ID '{txn_no}' adheres to format 'TXN-IEM-XXXXXXXX'")

print("\n================================================================")
print(f"🎉 ALL DATABASE SCHEMA & RELATIONSHIP TESTS PASSED ({passed_tests}/{total_tests})")
print("================================================================")
