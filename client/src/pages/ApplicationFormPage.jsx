import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';

export default function ApplicationFormPage({ applicantData, setApplicantData, setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [saveToast, setSaveToast] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isLocked = applicantData.status && applicantData.status !== 'draft' && applicantData.status !== 'correction_required';

  // Local state for form initialized from applicantData
  const [formData, setFormData] = useState({
    fullName: applicantData.fullName || '',
    gender: applicantData.gender || 'Male',
    dob: applicantData.dob ? applicantData.dob.substring(0, 10) : '2006-08-14',
    category: applicantData.category || 'General',
    bloodGroup: applicantData.bloodGroup || 'O+',
    nationality: applicantData.nationality || 'Indian',
    guardianName: applicantData.guardianName || applicantData.guardian?.name || '',
    guardianRelation: applicantData.guardianRelation || applicantData.guardian?.relation || 'Father',
    guardianPhone: applicantData.guardianPhone || applicantData.guardian?.phone || '',
    guardianOccupation: applicantData.guardianOccupation || applicantData.guardian?.occupation || '',
    annualFamilyIncome: applicantData.annualFamilyIncome || applicantData.guardian?.annualIncome || '1200000',
    address: applicantData.address?.street || applicantData.address || '',
    city: applicantData.address?.city || applicantData.city || '',
    state: applicantData.address?.state || applicantData.state || 'West Bengal',
    pincode: applicantData.address?.pincode || applicantData.pincode || '',

    // Academics
    class10Board: applicantData.academics?.class10?.board || 'ICSE',
    class10School: applicantData.academics?.class10?.school || '',
    class10PassingYear: applicantData.academics?.class10?.passingYear || '2022',
    class10Percentage: applicantData.academics?.class10?.percentage || '',

    class12Board: applicantData.academics?.class12?.board || 'ISC',
    class12School: applicantData.academics?.class12?.school || '',
    class12PassingYear: applicantData.academics?.class12?.passingYear || '2024',
    physicsMarks: applicantData.academics?.class12?.physics || '92',
    chemistryMarks: applicantData.academics?.class12?.chemistry || '89',
    mathsMarks: applicantData.academics?.class12?.maths || '95',
    overallPercentage: applicantData.academics?.class12?.overallPercentage || '93.5',

    // Entrance
    examType: applicantData.academics?.entranceExam?.examType || 'WBJEE',
    rollNumber: applicantData.academics?.entranceExam?.rollNumber || '',
    rank: applicantData.academics?.entranceExam?.rank || '',
    score: applicantData.academics?.entranceExam?.score || '',

    // Preferences
    pref1: applicantData.preferences?.[0]?.course || 'B.Tech - Computer Science & Engineering',
    pref2: applicantData.preferences?.[1]?.course || 'B.Tech - CSE (AI & Machine Learning)',
    pref3: applicantData.preferences?.[2]?.course || 'B.Tech - Information Technology'
  });

  // Resume saved draft from live server on mount if available
  useEffect(() => {
    const fetchLatestDraft = async () => {
      try {
        setIsLoading(true);
        const res = await applicationAPI.getMyApplication();
        if (res?.application && res?.applicant) {
          const app = res.application;
          const apl = res.applicant;

          setFormData({
            fullName: apl.userId?.fullName || applicantData.fullName || '',
            gender: apl.gender || 'Male',
            dob: apl.dob ? apl.dob.substring(0, 10) : '2006-08-14',
            category: apl.category || 'General',
            bloodGroup: apl.bloodGroup || 'O+',
            nationality: apl.nationality || 'Indian',
            guardianName: apl.guardian?.name || '',
            guardianRelation: apl.guardian?.relation || 'Father',
            guardianPhone: apl.guardian?.phone || '',
            guardianOccupation: apl.guardian?.occupation || '',
            annualFamilyIncome: apl.guardian?.annualIncome || '',
            address: apl.address?.street || '',
            city: apl.address?.city || '',
            state: apl.address?.state || 'West Bengal',
            pincode: apl.address?.pincode || '',
            class10Board: app.academics?.class10?.board || 'ICSE',
            class10School: app.academics?.class10?.school || '',
            class10PassingYear: app.academics?.class10?.passingYear || '2022',
            class10Percentage: app.academics?.class10?.percentage || '',
            class12Board: app.academics?.class12?.board || 'ISC',
            class12School: app.academics?.class12?.school || '',
            class12PassingYear: app.academics?.class12?.passingYear || '2024',
            physicsMarks: app.academics?.class12?.physics || '92',
            chemistryMarks: app.academics?.class12?.chemistry || '89',
            mathsMarks: app.academics?.class12?.maths || '95',
            overallPercentage: app.academics?.class12?.overallPercentage || '93.5',
            examType: app.academics?.entranceExam?.examType || 'WBJEE',
            rollNumber: app.academics?.entranceExam?.rollNumber || '',
            rank: app.academics?.entranceExam?.rank || '',
            score: app.academics?.entranceExam?.score || '',
            pref1: app.preferences?.[0]?.course || 'B.Tech - Computer Science & Engineering',
            pref2: app.preferences?.[1]?.course || 'B.Tech - CSE (AI & Machine Learning)',
            pref3: app.preferences?.[2]?.course || 'B.Tech - Information Technology'
          });

          // Sync applicantData state
          setApplicantData(prev => ({
            ...prev,
            ...apl,
            ...app,
            fullName: apl.userId?.fullName || prev.fullName
          }));
        }
      } catch (err) {
        // Fallback to local applicantData silently
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestDraft();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field-specific validation error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Calculate PCM aggregate
  const pcmAvg = (
    (parseFloat(formData.physicsMarks || 0) + 
     parseFloat(formData.chemistryMarks || 0) + 
     parseFloat(formData.mathsMarks || 0)) / 3
  ).toFixed(1);

  // Form Validation Logic
  const validateTab = (tab) => {
    const errors = {};

    if (tab === 'personal') {
      if (!formData.fullName.trim()) errors.fullName = 'Full Name is required.';
      if (!formData.dob) errors.dob = 'Date of birth is required.';
      if (!formData.guardianName.trim()) errors.guardianName = 'Guardian name is required.';
      if (!formData.guardianPhone.trim()) errors.guardianPhone = 'Guardian phone is required.';
      else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.guardianPhone.trim())) {
        errors.guardianPhone = 'Please provide a valid 10-digit phone number.';
      }
      if (!formData.address.trim()) errors.address = 'Street address is required.';
      if (!formData.city.trim()) errors.city = 'City is required.';
      if (!formData.pincode.trim()) errors.pincode = 'Pincode is required.';
      else if (!/^\d{6}$/.test(formData.pincode.trim())) {
        errors.pincode = 'Pincode must be 6 digits.';
      }
    } else if (tab === 'academics') {
      if (!formData.class10School.trim()) errors.class10School = '10th School name is required.';
      if (!formData.class10Percentage) errors.class10Percentage = '10th Percentage is required.';
      if (!formData.class12School.trim()) errors.class12School = '12th School name is required.';
      if (!formData.physicsMarks || formData.physicsMarks < 0 || formData.physicsMarks > 100) {
        errors.physicsMarks = 'Marks must be between 0 and 100.';
      }
      if (!formData.chemistryMarks || formData.chemistryMarks < 0 || formData.chemistryMarks > 100) {
        errors.chemistryMarks = 'Marks must be between 0 and 100.';
      }
      if (!formData.mathsMarks || formData.mathsMarks < 0 || formData.mathsMarks > 100) {
        errors.mathsMarks = 'Marks must be between 0 and 100.';
      }
    } else if (tab === 'entrance') {
      if (!formData.rollNumber.trim()) errors.rollNumber = 'Entrance roll number is required.';
      if (!formData.rank) errors.rank = 'General merit rank (GMR) is required.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveToGlobalState = () => {
    setApplicantData(prev => ({
      ...prev,
      fullName: formData.fullName,
      gender: formData.gender,
      dob: formData.dob,
      category: formData.category,
      bloodGroup: formData.bloodGroup,
      nationality: formData.nationality,
      guardianName: formData.guardianName,
      guardianRelation: formData.guardianRelation,
      guardianPhone: formData.guardianPhone,
      guardianOccupation: formData.guardianOccupation,
      annualFamilyIncome: formData.annualFamilyIncome,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      academics: {
        class10: {
          board: formData.class10Board,
          school: formData.class10School,
          passingYear: formData.class10PassingYear,
          percentage: formData.class10Percentage
        },
        class12: {
          board: formData.class12Board,
          school: formData.class12School,
          passingYear: formData.class12PassingYear,
          physics: formData.physicsMarks,
          chemistry: formData.chemistryMarks,
          maths: formData.mathsMarks,
          pcmPercentage: pcmAvg,
          overallPercentage: formData.overallPercentage
        },
        entranceExam: {
          examType: formData.examType,
          rollNumber: formData.rollNumber,
          rank: formData.rank,
          score: formData.score
        }
      },
      preferences: [
        { order: 1, course: formData.pref1 },
        { order: 2, course: formData.pref2 },
        { order: 3, course: formData.pref3 }
      ],
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST'
    }));
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    saveToGlobalState();

    try {
      await applicationAPI.saveDraft({
        personalInfo: {
          dob: formData.dob,
          gender: formData.gender,
          category: formData.category,
          bloodGroup: formData.bloodGroup,
          nationality: formData.nationality,
          guardian: {
            name: formData.guardianName,
            relation: formData.guardianRelation,
            phone: formData.guardianPhone,
            occupation: formData.guardianOccupation,
            annualIncome: Number(formData.annualFamilyIncome) || 0
          },
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          }
        },
        academics: {
          class10: { board: formData.class10Board, school: formData.class10School, passingYear: Number(formData.class10PassingYear), percentage: Number(formData.class10Percentage) },
          class12: { board: formData.class12Board, school: formData.class12School, passingYear: Number(formData.class12PassingYear), physics: Number(formData.physicsMarks), chemistry: Number(formData.chemistryMarks), maths: Number(formData.mathsMarks) },
          entranceExam: { examType: formData.examType, rollNumber: formData.rollNumber, rank: Number(formData.rank), score: formData.score }
        },
        preferences: [
          { order: 1, course: formData.pref1 },
          { order: 2, course: formData.pref2 },
          { order: 3, course: formData.pref3 }
        ]
      });
      setSaveToast('Application draft saved to server! You can resume anytime.');
    } catch (err) {
      setSaveToast('Application draft saved locally. (Backend sync note: ' + err.message + ')');
    }
    setTimeout(() => setSaveToast(''), 3500);
  };

  const handleProceedToDocuments = (e) => {
    e.preventDefault();
    if (!validateTab('personal') || !validateTab('academics') || !validateTab('entrance')) {
      setActiveTab('personal');
      return;
    }
    saveToGlobalState();
    setCurrentPage('document-upload');
  };

  const courseOptions = [
    'B.Tech - Computer Science & Engineering',
    'B.Tech - CSE (AI & Machine Learning)',
    'B.Tech - Information Technology',
    'B.Tech - Electronics & Communication',
    'B.Tech - Electrical Engineering',
    'BCA (Bachelor of Computer Applications)',
    'MCA (Master of Computer Applications)',
    'MBA (Master of Business Administration)'
  ];

  return (
    <div className="py-4" style={{ backgroundColor: '#f5f8fc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header Breadcrumb */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="badge bg-primary text-uppercase px-2 py-1 mb-1">Step 2 of 5</span>
            <h3 className="fw-bold mb-0 text-dark">Admission Application Form</h3>
            <p className="text-muted small mb-0">Application No: <strong className="text-primary font-monospace">{applicantData.applicationNumber}</strong></p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setCurrentPage('applicant-dashboard')}>
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </button>
            {!isLocked && (
              <button className="btn btn-outline-primary btn-sm" onClick={handleSaveDraft}>
                <i className="bi bi-save me-1"></i> Save Draft
              </button>
            )}
          </div>
        </div>

        {/* Locked Application Alert */}
        {isLocked && (
          <div className="alert alert-warning border-warning shadow-sm mb-4 d-flex align-items-center gap-3">
            <i className="bi bi-lock-fill fs-3 text-warning"></i>
            <div>
              <div className="fw-bold">Application Locked ({applicantData.status.toUpperCase()})</div>
              <div className="small">This application has been submitted and is under scrutiny by the Central Admission Committee. Modifications are restricted to preserve document integrity.</div>
            </div>
          </div>
        )}

        {saveToast && (
          <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 mb-4" role="alert">
            <i className="bi bi-check-circle-fill"></i>
            <div>{saveToast}</div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="iem-card mb-4">
          <ul className="nav nav-pills nav-fill p-2 bg-light rounded-top">
            <li className="nav-item">
              <button 
                className={`nav-link fw-semibold ${activeTab === 'personal' ? 'active bg-primary' : 'text-muted'}`}
                onClick={() => setActiveTab('personal')}
              >
                <i className="bi bi-person me-2"></i> 1. Personal & Guardian
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link fw-semibold ${activeTab === 'academics' ? 'active bg-primary' : 'text-muted'}`}
                onClick={() => setActiveTab('academics')}
              >
                <i className="bi bi-mortarboard me-2"></i> 2. Academic Scores
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link fw-semibold ${activeTab === 'entrance' ? 'active bg-primary' : 'text-muted'}`}
                onClick={() => setActiveTab('entrance')}
              >
                <i className="bi bi-trophy me-2"></i> 3. Entrance Exam
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link fw-semibold ${activeTab === 'preferences' ? 'active bg-primary' : 'text-muted'}`}
                onClick={() => setActiveTab('preferences')}
              >
                <i className="bi bi-diagram-3 me-2"></i> 4. Branch Preferences
              </button>
            </li>
          </ul>

          <div className="p-4">
            {/* Tab 1: Personal & Guardian */}
            {activeTab === 'personal' && (
              <div>
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">Personal Information</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Candidate Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      className={`form-control ${validationErrors.fullName ? 'is-invalid' : ''}`} 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.fullName && <div className="invalid-feedback">{validationErrors.fullName}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Date of Birth *</label>
                    <input 
                      type="date" 
                      name="dob" 
                      className={`form-control ${validationErrors.dob ? 'is-invalid' : ''}`} 
                      value={formData.dob} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.dob && <div className="invalid-feedback">{validationErrors.dob}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Gender *</label>
                    <select name="gender" className="form-select" value={formData.gender} onChange={handleChange} disabled={isLocked}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Category *</label>
                    <select name="category" className="form-select" value={formData.category} onChange={handleChange} disabled={isLocked}>
                      <option>General</option>
                      <option>SC</option>
                      <option>ST</option>
                      <option>OBC-A</option>
                      <option>OBC-B</option>
                      <option>EWS</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Blood Group</label>
                    <input type="text" name="bloodGroup" className="form-control" value={formData.bloodGroup} onChange={handleChange} disabled={isLocked} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Nationality</label>
                    <input type="text" name="nationality" className="form-control" value={formData.nationality} onChange={handleChange} disabled={isLocked} />
                  </div>
                </div>

                <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">Guardian / Parent Information</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Guardian / Parent Name *</label>
                    <input 
                      type="text" 
                      name="guardianName" 
                      className={`form-control ${validationErrors.guardianName ? 'is-invalid' : ''}`} 
                      value={formData.guardianName} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.guardianName && <div className="invalid-feedback">{validationErrors.guardianName}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Relationship</label>
                    <input type="text" name="guardianRelation" className="form-control" value={formData.guardianRelation} onChange={handleChange} disabled={isLocked} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Guardian Mobile *</label>
                    <input 
                      type="tel" 
                      name="guardianPhone" 
                      className={`form-control ${validationErrors.guardianPhone ? 'is-invalid' : ''}`} 
                      value={formData.guardianPhone} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.guardianPhone && <div className="invalid-feedback">{validationErrors.guardianPhone}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Guardian Occupation</label>
                    <input type="text" name="guardianOccupation" className="form-control" value={formData.guardianOccupation} onChange={handleChange} disabled={isLocked} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Annual Family Income (₹)</label>
                    <input type="number" name="annualFamilyIncome" className="form-control" value={formData.annualFamilyIncome} onChange={handleChange} disabled={isLocked} />
                  </div>
                </div>

                <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">Permanent Address</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-12">
                    <label className="form-label small fw-semibold">Street Address *</label>
                    <input 
                      type="text" 
                      name="address" 
                      className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`} 
                      value={formData.address} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.address && <div className="invalid-feedback">{validationErrors.address}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">City *</label>
                    <input 
                      type="text" 
                      name="city" 
                      className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`} 
                      value={formData.city} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.city && <div className="invalid-feedback">{validationErrors.city}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">State *</label>
                    <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} disabled={isLocked} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Pincode *</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      className={`form-control ${validationErrors.pincode ? 'is-invalid' : ''}`} 
                      value={formData.pincode} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.pincode && <div className="invalid-feedback">{validationErrors.pincode}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-iem-primary px-4" onClick={() => { if (validateTab('personal')) setActiveTab('academics'); }}>
                    Next: Academic Scores <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Academics */}
            {activeTab === 'academics' && (
              <div>
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">Secondary (Class 10) Details</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Board / University *</label>
                    <select name="class10Board" className="form-select" value={formData.class10Board} onChange={handleChange} disabled={isLocked}>
                      <option>ICSE</option>
                      <option>CBSE</option>
                      <option>WBBSE</option>
                      <option>Other State Board</option>
                    </select>
                  </div>
                  <div className="col-md-5">
                    <label className="form-label small fw-semibold">School Name & Location *</label>
                    <input 
                      type="text" 
                      name="class10School" 
                      className={`form-control ${validationErrors.class10School ? 'is-invalid' : ''}`} 
                      value={formData.class10School} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.class10School && <div className="invalid-feedback">{validationErrors.class10School}</div>}
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-semibold">Passing Year *</label>
                    <input type="number" name="class10PassingYear" className="form-control" value={formData.class10PassingYear} onChange={handleChange} disabled={isLocked} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-semibold">Percentage / CGPA *</label>
                    <input 
                      type="text" 
                      name="class10Percentage" 
                      className={`form-control ${validationErrors.class10Percentage ? 'is-invalid' : ''}`} 
                      value={formData.class10Percentage} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.class10Percentage && <div className="invalid-feedback">{validationErrors.class10Percentage}</div>}
                  </div>
                </div>

                <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">Higher Secondary (Class 12 / 10+2) Details</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Board / Council *</label>
                    <select name="class12Board" className="form-select" value={formData.class12Board} onChange={handleChange} disabled={isLocked}>
                      <option>ISC</option>
                      <option>CBSE</option>
                      <option>WBCHSE</option>
                      <option>Other State Board</option>
                    </select>
                  </div>
                  <div className="col-md-5">
                    <label className="form-label small fw-semibold">School / College Name *</label>
                    <input 
                      type="text" 
                      name="class12School" 
                      className={`form-control ${validationErrors.class12School ? 'is-invalid' : ''}`} 
                      value={formData.class12School} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.class12School && <div className="invalid-feedback">{validationErrors.class12School}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Passing Year *</label>
                    <input type="number" name="class12PassingYear" className="form-control" value={formData.class12PassingYear} onChange={handleChange} disabled={isLocked} />
                  </div>
                </div>

                <div className="card bg-light border-0 p-3 mb-4">
                  <h6 className="fw-bold text-primary mb-3">
                    <i className="bi bi-calculator me-1"></i> 10+2 Science Marks & PCM Aggregate Calculation
                  </h6>
                  <div className="row g-3 align-items-center">
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Physics Marks (%)</label>
                      <input 
                        type="number" 
                        name="physicsMarks" 
                        className={`form-control ${validationErrors.physicsMarks ? 'is-invalid' : ''}`} 
                        value={formData.physicsMarks} 
                        onChange={handleChange} 
                        disabled={isLocked}
                      />
                      {validationErrors.physicsMarks && <div className="invalid-feedback">{validationErrors.physicsMarks}</div>}
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Chemistry Marks (%)</label>
                      <input 
                        type="number" 
                        name="chemistryMarks" 
                        className={`form-control ${validationErrors.chemistryMarks ? 'is-invalid' : ''}`} 
                        value={formData.chemistryMarks} 
                        onChange={handleChange} 
                        disabled={isLocked}
                      />
                      {validationErrors.chemistryMarks && <div className="invalid-feedback">{validationErrors.chemistryMarks}</div>}
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Mathematics Marks (%)</label>
                      <input 
                        type="number" 
                        name="mathsMarks" 
                        className={`form-control ${validationErrors.mathsMarks ? 'is-invalid' : ''}`} 
                        value={formData.mathsMarks} 
                        onChange={handleChange} 
                        disabled={isLocked}
                      />
                      {validationErrors.mathsMarks && <div className="invalid-feedback">{validationErrors.mathsMarks}</div>}
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 bg-white rounded-3 border text-center shadow-sm">
                        <div className="text-muted small text-uppercase">PCM Aggregate</div>
                        <div className="fs-4 fw-bold text-success">{pcmAvg}%</div>
                        <div className="small text-muted">{pcmAvg >= 60 ? '✓ Eligible for B.Tech' : pcmAvg >= 45 ? '⚠ Eligible for General B.Tech' : '❌ Below 45% AICTE threshold'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setActiveTab('personal')}>
                    <i className="bi bi-arrow-left me-1"></i> Previous
                  </button>
                  <button type="button" className="btn btn-iem-primary px-4" onClick={() => { if (validateTab('academics')) setActiveTab('entrance'); }}>
                    Next: Entrance Exam <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Entrance Exam */}
            {activeTab === 'entrance' && (
              <div>
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">Competitive / Entrance Examination</h5>
                <p className="text-muted small mb-4">
                  Provide your entrance examination details. B.Tech counseling primarily considers WBJEE, JEE Main, or IEMJEE ranks.
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Exam Appeared *</label>
                    <select name="examType" className="form-select" value={formData.examType} onChange={handleChange} disabled={isLocked}>
                      <option>WBJEE</option>
                      <option>JEE Main</option>
                      <option>IEMJEE</option>
                      <option>WB-JECA (for MCA)</option>
                      <option>CAT / MAT / JEMAT (for MBA)</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Admit Card / Roll Number *</label>
                    <input 
                      type="text" 
                      name="rollNumber" 
                      className={`form-control ${validationErrors.rollNumber ? 'is-invalid' : ''}`} 
                      placeholder="e.g. 240182903" 
                      value={formData.rollNumber} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.rollNumber && <div className="invalid-feedback">{validationErrors.rollNumber}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">General Merit Rank (GMR) *</label>
                    <input 
                      type="text" 
                      name="rank" 
                      className={`form-control ${validationErrors.rank ? 'is-invalid' : ''}`} 
                      placeholder="e.g. 1420" 
                      value={formData.rank} 
                      onChange={handleChange} 
                      disabled={isLocked}
                      required 
                    />
                    {validationErrors.rank && <div className="invalid-feedback">{validationErrors.rank}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Total Score / Percentile</label>
                    <input type="text" name="score" className="form-control" placeholder="e.g. 112.5 or 96.2 %ile" value={formData.score} onChange={handleChange} disabled={isLocked} />
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setActiveTab('academics')}>
                    <i className="bi bi-arrow-left me-1"></i> Previous
                  </button>
                  <button type="button" className="btn btn-iem-primary px-4" onClick={() => { if (validateTab('entrance')) setActiveTab('preferences'); }}>
                    Next: Branch Selection <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Preferences */}
            {activeTab === 'preferences' && (
              <div>
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">Course & Branch Preference Order</h5>
                <p className="text-muted small mb-4">
                  Select your top 3 preferred branches at IEM. Allotment will be processed based on merit cutoff and seat availability.
                </p>

                <div className="row g-4 mb-4">
                  <div className="col-md-12">
                    <div className="card p-3 border-start border-4 border-primary bg-light">
                      <label className="form-label fw-bold text-dark mb-1">
                        <span className="badge bg-primary me-2">Choice 1</span> 1st Priority Branch *
                      </label>
                      <select name="pref1" className="form-select form-select-lg" value={formData.pref1} onChange={handleChange} disabled={isLocked}>
                        {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card p-3 border-start border-4 border-info bg-light">
                      <label className="form-label fw-bold text-dark mb-1">
                        <span className="badge bg-info text-dark me-2">Choice 2</span> 2nd Priority Branch *
                      </label>
                      <select name="pref2" className="form-select" value={formData.pref2} onChange={handleChange} disabled={isLocked}>
                        {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card p-3 border-start border-4 border-secondary bg-light">
                      <label className="form-label fw-bold text-dark mb-1">
                        <span className="badge bg-secondary me-2">Choice 3</span> 3rd Priority Branch *
                      </label>
                      <select name="pref3" className="form-select" value={formData.pref3} onChange={handleChange} disabled={isLocked}>
                        {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info small d-flex align-items-center gap-2">
                  <i className="bi bi-info-circle-fill fs-5"></i>
                  <span>You can save your incomplete form as a draft and resume it anytime. Once you proceed, upload your marksheets and rank card.</span>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setActiveTab('entrance')}>
                    <i className="bi bi-arrow-left me-1"></i> Previous
                  </button>
                  <div className="d-flex gap-2">
                    {!isLocked && (
                      <button type="button" className="btn btn-outline-primary px-3" onClick={handleSaveDraft}>
                        <i className="bi bi-save me-1"></i> Save Draft
                      </button>
                    )}
                    <button type="button" className="btn btn-iem-primary px-4 fw-bold" onClick={handleProceedToDocuments}>
                      Save & Proceed to Document Upload <i className="bi bi-arrow-right ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
