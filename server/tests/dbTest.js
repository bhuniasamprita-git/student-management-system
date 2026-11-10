/**
 * Comprehensive Database Operations Test Suite for IEM Admission Portal
 * Verifies all 8 MongoDB Collections & Relational Referencing:
 * 1. Users
 * 2. Applicants
 * 3. Applications
 * 4. Documents
 * 5. Payments
 * 6. Notifications
 * 7. Admins
 * 8. AuditLogs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
  User,
  Applicant,
  Application,
  Document,
  Payment,
  Notification,
  Admin,
  AuditLog
} from '../models/index.js';

dotenv.config();

const runAllDatabaseTests = async () => {
  console.log('====================================================');
  console.log('🧪 Starting IEM Admission Portal Database Test Suite');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  const assert = (condition, testName) => {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS]: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL]: ${testName}`);
      throw new Error(`Test failed: ${testName}`);
    }
  };

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/iem_admission_portal_test';
    await mongoose.connect(mongoUri);
    console.log(`Connected to Test Database: ${mongoUri}\n`);

    // --- TEST 1: User Collection & Password Hashing ---
    console.log('--- Testing 1/8: User Collection ---');
    const testUser = await User.create({
      fullName: 'Test Candidate',
      email: `test_${Date.now()}@example.com`,
      phone: '+91 99999 88888',
      password: 'plainPassword123',
      role: 'applicant'
    });
    assert(testUser._id, 'User record created with valid ObjectId');
    assert(testUser.password !== 'plainPassword123', 'Password successfully hashed with bcrypt');
    const isPasswordValid = await testUser.matchPassword('plainPassword123');
    assert(isPasswordValid === true, 'bcrypt matchPassword() verifies correct password');

    // --- TEST 2: Applicant Collection & Reference to User ---
    console.log('\n--- Testing 2/8: Applicant Collection ---');
    const testApplicant = await Applicant.create({
      userId: testUser._id,
      applicationNumber: `IEM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      dob: new Date('2006-05-15'),
      gender: 'Male',
      category: 'General',
      guardian: { name: 'Guardian Name', phone: '+91 99999 77777', annualIncome: 800000 },
      address: { city: 'Kolkata', state: 'West Bengal', pincode: '700091' }
    });
    assert(testApplicant._id, 'Applicant record created');
    assert(testApplicant.userId.toString() === testUser._id.toString(), 'Applicant correctly references User._id');

    // Test Population
    const populatedApplicant = await Applicant.findById(testApplicant._id).populate('userId');
    assert(populatedApplicant.userId.email === testUser.email, 'populate("userId") correctly retrieves User data');

    // --- TEST 3: Application Collection & Academic Calculations ---
    console.log('\n--- Testing 3/8: Application Collection ---');
    const p = 88, c = 92, m = 96;
    const expectedPCM = parseFloat(((p + c + m) / 3).toFixed(1)); // 92.0

    const testApp = await Application.create({
      applicantId: testApplicant._id,
      userId: testUser._id,
      applicationNumber: testApplicant.applicationNumber,
      academics: {
        class10: { board: 'CBSE', passingYear: 2022, percentage: 95.0 },
        class12: { board: 'CBSE', passingYear: 2024, physics: p, chemistry: c, maths: m, pcmPercentage: expectedPCM },
        entranceExam: { examType: 'WBJEE', rollNumber: 'WB2401', rank: 1250 }
      },
      preferences: [
        { order: 1, course: 'B.Tech - Computer Science & Engineering' },
        { order: 2, course: 'B.Tech - Information Technology' }
      ],
      status: 'submitted'
    });
    assert(testApp._id, 'Application record created');
    assert(testApp.academics.class12.pcmPercentage === 92.0, 'PCM percentage calculated and saved correctly (92.0%)');
    assert(testApp.applicantId.toString() === testApplicant._id.toString(), 'Application correctly references Applicant._id');

    // --- TEST 4: Document Collection & Relational Attachment ---
    console.log('\n--- Testing 4/8: Document Collection ---');
    const testDoc = await Document.create({
      applicationId: testApp._id,
      applicantId: testApplicant._id,
      documentType: 'class12Marksheet',
      fileName: 'cbse_12th_marksheet.pdf',
      filePath: 'uploads/test_marksheet.pdf',
      fileSize: '1.2 MB',
      status: 'verified'
    });
    assert(testDoc._id, 'Document record created');
    assert(testDoc.applicationId.toString() === testApp._id.toString(), 'Document references Application._id');

    // Attach to Application
    testApp.documents.push(testDoc._id);
    await testApp.save();

    const populatedAppWithDocs = await Application.findById(testApp._id).populate('documents');
    assert(populatedAppWithDocs.documents.length === 1, 'Application has 1 populated Document reference');
    assert(populatedAppWithDocs.documents[0].fileName === 'cbse_12th_marksheet.pdf', 'Document details correctly populated');

    // --- TEST 5: Payment Collection ---
    console.log('\n--- Testing 5/8: Payment Collection ---');
    const txnId = `TXN-TEST-${Date.now()}`;
    const testPayment = await Payment.create({
      applicationId: testApp._id,
      applicantId: testApplicant._id,
      userId: testUser._id,
      transactionId: txnId,
      amount: 1000,
      currency: 'INR',
      paymentMethod: 'UPI',
      status: 'completed',
      paidAt: new Date()
    });
    assert(testPayment._id, 'Payment record created');
    assert(testPayment.status === 'completed', 'Payment status is completed');

    // Link Payment to Application
    testApp.paymentId = testPayment._id;
    await testApp.save();

    const populatedAppWithPayment = await Application.findById(testApp._id).populate('paymentId');
    assert(populatedAppWithPayment.paymentId.transactionId === txnId, 'Payment correctly populated into Application');

    // --- TEST 6: Notification Collection ---
    console.log('\n--- Testing 6/8: Notification Collection ---');
    const testNotification = await Notification.create({
      recipientId: testUser._id,
      title: 'Test Notification',
      message: 'Your documents have been verified.',
      type: 'status_update'
    });
    assert(testNotification._id, 'Notification record created');
    assert(testNotification.isRead === false, 'Default isRead status is false');

    testNotification.isRead = true;
    testNotification.readAt = new Date();
    await testNotification.save();
    assert(testNotification.isRead === true, 'Notification can be marked as read');

    // --- TEST 7: Admin Collection & Privileges ---
    console.log('\n--- Testing 7/8: Admin Collection ---');
    const testAdminUser = await User.create({
      fullName: 'Admission Officer Test',
      email: `admin_${Date.now()}@iemcal.com`,
      phone: '+91 33 2357 0000',
      password: 'adminSecurePassword',
      role: 'admin'
    });
    const testAdmin = await Admin.create({
      userId: testAdminUser._id,
      employeeId: `EMP-${Date.now()}`,
      department: 'Central Admission Directorate',
      designation: 'Senior Scrutiny Officer',
      permissions: ['verify_documents', 'allot_seats']
    });
    assert(testAdmin._id, 'Admin profile created');
    assert(testAdmin.permissions.includes('allot_seats'), 'Admin profile permissions correctly assigned');

    // --- TEST 8: AuditLog Collection ---
    console.log('\n--- Testing 8/8: AuditLog Collection ---');
    const testLog = await AuditLog.create({
      action: 'SEAT_ALLOTTED',
      performedBy: testAdminUser._id,
      performerRole: 'admin',
      targetApplication: testApp._id,
      details: { previousStatus: 'verified', newStatus: 'seat_allotted', branch: 'B.Tech CSE' }
    });
    assert(testLog._id, 'AuditLog entry created');
    assert(testLog.action === 'SEAT_ALLOTTED', 'Audit action recorded accurately');

    const populatedLog = await AuditLog.findById(testLog._id).populate('performedBy').populate('targetApplication');
    assert(populatedLog.performedBy.fullName === 'Admission Officer Test', 'AuditLog populates performedBy User');
    assert(populatedLog.targetApplication.applicationNumber === testApp.applicationNumber, 'AuditLog populates targetApplication');

    // --- CLEANUP TEST DATA ---
    await User.deleteMany({ _id: { $in: [testUser._id, testAdminUser._id] } });
    await Applicant.deleteMany({ _id: testApplicant._id });
    await Application.deleteMany({ _id: testApp._id });
    await Document.deleteMany({ _id: testDoc._id });
    await Payment.deleteMany({ _id: testPayment._id });
    await Notification.deleteMany({ _id: testNotification._id });
    await Admin.deleteMany({ _id: testAdmin._id });
    await AuditLog.deleteMany({ _id: testLog._id });
    console.log('\n🧹 Test artifacts cleaned up successfully.');

    console.log('\n====================================================');
    console.log(`🎉 ALL DATABASE TESTS PASSED (${passedTests}/${totalTests})`);
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database Test Error:', error.message);
    process.exit(1);
  }
};

runAllDatabaseTests();
