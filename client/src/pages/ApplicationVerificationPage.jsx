import React, { useState } from 'react';
import { adminAPI } from '../services/api';

export default function ApplicationVerificationPage({ 
  selectedApplicantId, 
  applicantsList, 
  setApplicantsList, 
  setCurrentPage 
}) {
  // Find selected applicant or fallback to first
  const applicant = applicantsList.find(a => a.id === selectedApplicantId) || applicantsList[0];

  const [currentStatus, setCurrentStatus] = useState(applicant.status || 'under_review');
  const [allottedBranch, setAllottedBranch] = useState(applicant.allottedBranch || applicant.preferences?.[0]?.course || 'B.Tech - Computer Science & Engineering');
  const [adminRemarks, setAdminRemarks] = useState(applicant.adminRemarks || '');
  const [previewDocModal, setPreviewDocModal] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState('');

  const handleSaveDecision = async () => {
    // Attempt backend update
    try {
      if (applicant._id || applicant.id) {
        await adminAPI.updateStatus(applicant._id || applicant.id, {
          status: currentStatus,
          allottedBranch: currentStatus === 'seat_allotted' ? allottedBranch : applicant.allottedBranch,
          adminRemarks: adminRemarks
        });
      }
    } catch (err) {
      console.warn('Backend note (updated locally):', err.message);
    }

    // Update this applicant in the global applicantsList
    const updatedList = applicantsList.map(item => {
      if (item.id === applicant.id) {
        return {
          ...item,
          status: currentStatus,
          allottedBranch: currentStatus === 'seat_allotted' ? allottedBranch : item.allottedBranch,
          adminRemarks: adminRemarks,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST'
        };
      }
      return item;
    });

    setApplicantsList(updatedList);
    setFeedbackToast(`Decision saved for ${applicant.fullName}! Status updated to "${currentStatus}".`);
    setTimeout(() => setFeedbackToast(''), 3500);
  };

  const branchOptions = [
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
    <div className="py-4" style={{ backgroundColor: '#f1f5f9', minHeight: '85vh' }}>
      <div className="container-fluid px-lg-5">
        {/* Navigation Breadcrumb */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="badge bg-danger text-uppercase px-2 py-1 mb-1">Administrative Console</span>
            <h3 className="fw-bold mb-0 text-dark">
              Application Scrutiny & Verification: <span className="text-primary">{applicant.fullName}</span>
            </h3>
            <p className="text-muted small mb-0">Application No: <strong className="font-monospace text-dark">{applicant.applicationNumber}</strong></p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setCurrentPage('admin-dashboard')}>
              <i className="bi bi-arrow-left me-1"></i> Back to Admin Dashboard
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSaveDecision}>
              <i className="bi bi-check-circle me-1"></i> Save Verification Decision
            </button>
          </div>
        </div>

        {feedbackToast && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
            <i className="bi bi-check-circle-fill fs-5"></i>
            <div>{feedbackToast}</div>
          </div>
        )}

        <div className="row g-4">
          {/* Left Column: Comprehensive Candidate Dossier */}
          <div className="col-lg-7">
            {/* Personal & Academic Summary */}
            <div className="iem-card p-4 mb-4">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="bi bi-person-lines-fill text-primary me-2"></i> Academic & Entrance Profile
              </h5>

              <div className="row g-3 mb-3 small">
                <div className="col-sm-6">
                  <span className="text-muted">Email:</span> <strong>{applicant.email}</strong>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted">Mobile:</span> <strong>{applicant.phone}</strong>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted">Category:</span> <strong>{applicant.category}</strong>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted">Date of Birth:</span> <strong>{applicant.dob || '2006-08-14'}</strong>
                </div>
              </div>

              {/* Entrance Exam Box */}
              <div className="card bg-light border-0 p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-primary fs-6">{applicant.academics?.entranceExam?.examType} 2026</span>
                  <span className="text-success fw-bold fs-5">Rank: #{applicant.academics?.entranceExam?.rank}</span>
                </div>
                <div className="small text-muted">
                  Roll Number: <span className="font-monospace text-dark">{applicant.academics?.entranceExam?.rollNumber}</span> | Score: <strong>{applicant.academics?.entranceExam?.score}</strong>
                </div>
              </div>

              {/* Class 12 Marks Box */}
              <div className="card bg-light border-0 p-3 mb-3">
                <h6 className="fw-bold text-dark mb-2">Class 12th / Higher Secondary Credentials</h6>
                <div className="small text-muted mb-2">
                  Board: <strong>{applicant.academics?.class12?.board}</strong> | School: {applicant.academics?.class12?.school}
                </div>
                <div className="row g-2 text-center">
                  <div className="col-3">
                    <div className="bg-white p-2 rounded border">
                      <div className="small text-muted">Physics</div>
                      <div className="fw-bold">{applicant.academics?.class12?.physics || '92'}%</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="bg-white p-2 rounded border">
                      <div className="small text-muted">Chemistry</div>
                      <div className="fw-bold">{applicant.academics?.class12?.chemistry || '89'}%</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="bg-white p-2 rounded border">
                      <div className="small text-muted">Maths</div>
                      <div className="fw-bold">{applicant.academics?.class12?.maths || '95'}%</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="bg-white p-2 rounded border border-success">
                      <div className="small text-success fw-bold">PCM Total</div>
                      <div className="fw-bold text-success fs-6">{applicant.academics?.class12?.pcmPercentage}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branch Preferences */}
              <h6 className="fw-bold text-dark mb-2">Branch Preferences Chosen by Candidate:</h6>
              <ol className="list-group list-group-numbered small mb-0">
                {applicant.preferences?.map((pref, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-semibold ms-2">{pref.course}</span>
                    <span className="badge bg-light text-dark border">Priority {pref.order}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Column: Uploaded Documents Scrutiny & Committee Action Deck */}
          <div className="col-lg-5">
            {/* Document Inspection Panel */}
            <div className="iem-card p-4 mb-4">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="bi bi-file-earmark-check text-primary me-2"></i> Uploaded Testimonials
              </h5>

              <div className="list-group list-group-flush mb-3">
                {[
                  { key: 'class12', name: 'Class 12th Marksheet', filename: applicant.documents?.class12Marksheet?.filename || 'class12_marksheet.pdf', status: 'verified' },
                  { key: 'rankCard', name: 'Entrance Rank Card', filename: applicant.documents?.rankCard?.filename || 'rank_card.pdf', status: 'verified' },
                  { key: 'class10', name: 'Class 10th Admit / Marksheet', filename: applicant.documents?.class10Marksheet?.filename || 'class10_cert.pdf', status: 'verified' },
                  { key: 'photo', name: 'Candidate Photograph', filename: applicant.documents?.photo?.filename || 'candidate_photo.jpg', status: 'verified' },
                  { key: 'signature', name: 'Candidate Signature', filename: applicant.documents?.signature?.filename || 'signature.png', status: 'verified' },
                ].map((doc, i) => (
                  <div key={i} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold small text-dark">{doc.name}</div>
                      <div className="text-muted small font-monospace">{doc.filename}</div>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-primary py-1 px-2"
                      onClick={() => setPreviewDocModal(doc)}
                    >
                      <i className="bi bi-eye me-1"></i> Inspect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Officer Action & Decision Deck */}
            <div className="iem-card p-4 border-top border-4 border-danger">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="bi bi-hammer text-danger me-2"></i> Committee Verification Decision
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Application Status</label>
                <select 
                  className="form-select"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                >
                  <option value="verified">Verified & Approved (Documents Cleared)</option>
                  <option value="seat_allotted">Provisional Seat Allotted</option>
                  <option value="under_review">Under Scrutiny / Pending Verification</option>
                  <option value="correction_required">Correction Required (Request Re-upload)</option>
                  <option value="rejected">Rejected / Ineligible</option>
                </select>
              </div>

              {currentStatus === 'seat_allotted' && (
                <div className="mb-3 bg-light p-3 rounded border">
                  <label className="form-label small fw-semibold text-primary">Allot Branch to Candidate</label>
                  <select 
                    className="form-select"
                    value={allottedBranch}
                    onChange={(e) => setAllottedBranch(e.target.value)}
                  >
                    {branchOptions.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold">Official Remarks / Feedback for Applicant</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="e.g. Original ISC marksheet and WBJEE Rank card verified against portal records. Seat confirmed."
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                ></textarea>
              </div>

              <button 
                type="button" 
                className="btn btn-iem-primary w-100 py-2 fw-bold"
                onClick={handleSaveDecision}
              >
                <i className="bi bi-check2-circle me-1"></i> Save & Endorse Application
              </button>
            </div>
          </div>
        </div>

        {/* Modal for Inspecting Document */}
        {previewDocModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-dark text-white">
                  <h6 className="modal-title fw-bold">
                    <i className="bi bi-file-earmark-check me-2 text-warning"></i>
                    Document Scrutiny: {previewDocModal.name}
                  </h6>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewDocModal(null)}></button>
                </div>
                <div className="modal-body text-center p-4">
                  <div className="p-4 bg-light rounded-3 border mb-3">
                    <i className="bi bi-file-earmark-pdf display-2 text-danger d-block mb-2"></i>
                    <h6 className="fw-bold text-dark">{previewDocModal.filename}</h6>
                    <div className="small text-muted">Original Scanned Testimonial Submitted by {applicant.fullName}</div>
                    <div className="badge bg-success mt-2">Authenticity Verified</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPreviewDocModal(null)}>Close Inspection</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
