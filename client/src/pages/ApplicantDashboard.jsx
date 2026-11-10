import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';

export default function ApplicantDashboard({ applicantData, setCurrentPage }) {
  const [notifications, setNotifications] = useState([]);

  // Calculate completion percentage based on current state
  let progressPercent = 20; // Registration done
  if (applicantData.academics?.class12?.pcmPercentage) progressPercent += 20; // Form done
  if (applicantData.documents?.photo?.uploaded || applicantData.documents?.class12Marksheet?.uploaded) progressPercent += 20; // Docs done
  if (applicantData.payment?.status === 'completed' || applicantData.paymentId?.status === 'completed') progressPercent += 20; // Payment done
  if (applicantData.status === 'verified' || applicantData.status === 'seat_allotted' || applicantData.status === 'admitted') progressPercent += 20; // Verified

  const status = applicantData.status || 'draft';
  const isDraft = status === 'draft';
  const isFeePaid = applicantData.payment?.status === 'completed' || applicantData.paymentId?.status === 'completed';

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await applicationAPI.getNotifications();
        if (res?.notifications) {
          setNotifications(res.notifications);
        }
      } catch (e) {
        // Fallback default notifications
      }
    };
    fetchNotifs();
  }, []);

  const getStatusBadge = (s) => {
    switch (s) {
      case 'verified':
        return <span className="badge bg-success px-3 py-2 fs-6"><i className="bi bi-check-circle-fill me-1"></i> Documents Verified</span>;
      case 'seat_allotted':
        return <span className="badge bg-primary px-3 py-2 fs-6"><i className="bi bi-award-fill me-1"></i> Provisional Seat Allotted</span>;
      case 'under_review':
        return <span className="badge bg-warning text-dark px-3 py-2 fs-6"><i className="bi bi-hourglass-split me-1"></i> Under Committee Scrutiny</span>;
      case 'correction_required':
        return <span className="badge bg-danger px-3 py-2 fs-6"><i className="bi bi-exclamation-triangle-fill me-1"></i> Resubmission Required</span>;
      case 'submitted':
        return <span className="badge bg-info text-dark px-3 py-2 fs-6"><i className="bi bi-send-fill me-1"></i> Application Submitted</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2 fs-6"><i className="bi bi-pencil me-1"></i> Incomplete (Draft)</span>;
    }
  };

  return (
    <div className="py-4" style={{ backgroundColor: '#f5f8fc', minHeight: '85vh' }}>
      <div className="container">
        {/* Welcome Header */}
        <div className="iem-card p-4 mb-4 border-0 text-white" style={{ background: 'linear-gradient(135deg, #0a2240, #1b497e)' }}>
          <div className="row align-items-center g-3">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark fw-bold mb-2">Admission Cycle 2026-27</span>
              <h2 className="fw-bold mb-1">Welcome back, {applicantData.fullName}!</h2>
              <div className="d-flex flex-wrap gap-3 small opacity-90">
                <span><i className="bi bi-hash"></i> Application No: <strong className="font-monospace">{applicantData.applicationNumber}</strong></span>
                <span><i className="bi bi-envelope"></i> {applicantData.email}</span>
                <span><i className="bi bi-telephone"></i> {applicantData.phone}</span>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="mb-2">{getStatusBadge(status)}</div>
              <div className="small text-light opacity-75">
                Last updated: {applicantData.lastUpdated || 'Today'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Prompt: Resume Incomplete Application */}
        {isDraft && (
          <div className="alert alert-primary border-primary shadow-sm p-4 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5 className="fw-bold text-primary mb-1">
                <i className="bi bi-play-circle-fill me-2"></i> Resume Incomplete Application
              </h5>
              <div className="small text-dark">
                You have an application draft saved. Complete your academic scores and document uploads to participate in Round 1 seat allocation.
              </div>
            </div>
            <button 
              className="btn btn-iem-primary px-4 py-2 fw-bold"
              onClick={() => setCurrentPage('application-form')}
            >
              Resume Application <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        )}

        {/* Action Prompt: Correction Required */}
        {status === 'correction_required' && (
          <div className="alert alert-danger shadow-sm p-4 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5 className="fw-bold text-danger mb-1">
                <i className="bi bi-exclamation-triangle-fill me-2"></i> Document Correction Required
              </h5>
              <div className="small text-dark mb-1">
                The Admission Directorate has requested document correction: <strong>"{applicantData.adminRemarks}"</strong>
              </div>
            </div>
            <button 
              className="btn btn-danger px-4 py-2 fw-bold"
              onClick={() => setCurrentPage('document-upload')}
            >
              Re-upload Documents <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        )}

        {/* Admission Progress Stepper */}
        <div className="iem-card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0 text-dark">
              <i className="bi bi-list-check text-primary me-2"></i> Application Completion Progress
            </h5>
            <span className="fw-bold text-primary">{progressPercent}% Completed</span>
          </div>
          
          <div className="progress mb-4" style={{ height: '10px' }}>
            <div 
              className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
              role="progressbar" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="stepper-wrapper mb-0">
            <div className="stepper-item completed" onClick={() => setCurrentPage('register')}>
              <div className="step-counter"><i className="bi bi-check-lg"></i></div>
              <div className="step-name">1. Registration</div>
            </div>
            <div className={`stepper-item ${progressPercent >= 40 ? 'completed' : 'active'}`} onClick={() => setCurrentPage('application-form')}>
              <div className="step-counter">{progressPercent >= 40 ? <i className="bi bi-check-lg"></i> : '2'}</div>
              <div className="step-name">2. Application Form</div>
            </div>
            <div className={`stepper-item ${progressPercent >= 60 ? 'completed' : progressPercent >= 40 ? 'active' : ''}`} onClick={() => setCurrentPage('document-upload')}>
              <div className="step-counter">{progressPercent >= 60 ? <i className="bi bi-check-lg"></i> : '3'}</div>
              <div className="step-name">3. Documents</div>
            </div>
            <div className={`stepper-item ${isFeePaid ? 'completed' : 'active'}`} onClick={() => setCurrentPage('payment')}>
              <div className="step-counter">{isFeePaid ? <i className="bi bi-check-lg"></i> : '4'}</div>
              <div className="step-name">4. Fee Payment</div>
            </div>
            <div className={`stepper-item ${status !== 'draft' ? 'completed' : ''}`} onClick={() => setCurrentPage('application-status')}>
              <div className="step-counter">{status !== 'draft' ? <i className="bi bi-check-lg"></i> : '5'}</div>
              <div className="step-name">5. Verification</div>
            </div>
          </div>
        </div>

        {/* Quick Info & Action Cards */}
        <div className="row g-4 mb-4">
          {/* Card 1: Form Status */}
          <div className="col-md-6 col-lg-3">
            <div className="iem-card p-3 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Application Form</span>
                  <i className="bi bi-file-earmark-text text-primary fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark">
                  {applicantData.preferences?.[0]?.course || 'B.Tech Program'}
                </h6>
                <p className="text-muted small mb-3">
                  PCM: <strong>{applicantData.academics?.class12?.pcmPercentage || '-'}%</strong> | Rank: <strong>#{applicantData.academics?.entranceExam?.rank || '-'}</strong>
                </p>
              </div>
              <button 
                className="btn btn-outline-primary btn-sm w-100"
                onClick={() => setCurrentPage('application-form')}
              >
                <i className="bi bi-pencil-square me-1"></i> {isDraft ? 'Resume Form' : 'View Form'}
              </button>
            </div>
          </div>

          {/* Card 2: Documents */}
          <div className="col-md-6 col-lg-3">
            <div className="iem-card p-3 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Document Scrutiny</span>
                  <i className="bi bi-file-earmark-check text-success fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark">
                  {Object.values(applicantData.documents || {}).filter(d => d?.uploaded).length} Uploaded
                </h6>
                <p className="text-muted small mb-3">
                  Photo, Marksheets & Rank card repository
                </p>
              </div>
              <button 
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => setCurrentPage('document-upload')}
              >
                <i className="bi bi-eye me-1"></i> Manage Documents
              </button>
            </div>
          </div>

          {/* Card 3: Fee Payment */}
          <div className="col-md-6 col-lg-3">
            <div className="iem-card p-3 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Application Fee</span>
                  <i className="bi bi-credit-card-2-back text-warning fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark">
                  {isFeePaid ? '₹1,000 Paid' : '₹1,000 Pending'}
                </h6>
                <p className="text-muted small mb-3 font-monospace text-truncate">
                  {applicantData.payment?.transactionId || 'Payment Pending'}
                </p>
              </div>
              <button 
                className={`btn ${isFeePaid ? 'btn-outline-success' : 'btn-iem-primary'} btn-sm w-100`}
                onClick={() => setCurrentPage('payment')}
              >
                <i className="bi bi-receipt me-1"></i> {isFeePaid ? 'View Receipt' : 'Pay ₹1,000'}
              </button>
            </div>
          </div>

          {/* Card 4: Status / Letter */}
          <div className="col-md-6 col-lg-3">
            <div className="iem-card p-3 h-100 d-flex flex-column justify-content-between border-start border-4 border-success">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Admission Letter</span>
                  <i className="bi bi-award text-success fs-4"></i>
                </div>
                <h6 className="fw-bold text-success">
                  {applicantData.allottedBranch ? 'Seat Allotted' : status.replace('_', ' ').toUpperCase()}
                </h6>
                <p className="text-muted small mb-3 text-truncate">
                  {applicantData.allottedBranch || 'Provisional Letter Pending'}
                </p>
              </div>
              <button 
                className="btn btn-iem-primary btn-sm w-100"
                onClick={() => setCurrentPage('application-status')}
              >
                <i className="bi bi-file-earmark-check me-1"></i> Track & Print
              </button>
            </div>
          </div>
        </div>

        {/* Live Notifications & Official Remarks */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="iem-card p-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-chat-left-quote text-primary me-2"></i> Official Committee Notice & Updates
              </h5>
              <div className="alert alert-success d-flex align-items-start gap-3 mb-3">
                <i className="bi bi-check-circle-fill fs-4 text-success mt-1"></i>
                <div>
                  <div className="fw-bold">Status: {status.toUpperCase().replace('_', ' ')}</div>
                  <div className="small text-muted mt-1">{applicantData.adminRemarks || 'Your application profile is active for 2026-27 admission.'}</div>
                  {applicantData.allottedBranch && (
                    <div className="small text-dark mt-2">
                      <strong>Allotted Branch:</strong> {applicantData.allottedBranch} ({applicantData.allottedCategory || 'General Merit'})
                    </div>
                  )}
                </div>
              </div>

              {notifications.length > 0 && (
                <div className="mt-3">
                  <h6 className="fw-bold text-dark mb-2 small text-uppercase">Recent Messages</h6>
                  <div className="list-group list-group-flush">
                    {notifications.slice(0, 3).map((notif, idx) => (
                      <div key={idx} className="list-group-item px-0 py-2 border-0 border-bottom small">
                        <div className="fw-semibold text-dark">{notif.title}</div>
                        <div className="text-muted">{notif.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex gap-3 mt-4">
                <button 
                  className="btn btn-iem-primary"
                  onClick={() => setCurrentPage('application-status')}
                >
                  <i className="bi bi-printer me-2"></i> Print Official Acknowledgment
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => setCurrentPage('application-form')}
                >
                  <i className="bi bi-eye me-2"></i> View Application Details
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="iem-card p-4">
              <h6 className="fw-bold text-dark mb-3">
                <i className="bi bi-headset text-warning me-2"></i> Admission Helpdesk
              </h6>
              <p className="small text-muted mb-3">
                For queries regarding merit counseling, fee reconciliation, or document verification:
              </p>
              <div className="small bg-light p-3 rounded-3 mb-3">
                <div><i className="bi bi-telephone text-primary me-2"></i> +91 33 2357 2995</div>
                <div className="my-1"><i className="bi bi-whatsapp text-success me-2"></i> +91 98301 23456</div>
                <div><i className="bi bi-envelope text-danger me-2"></i> admissions@iemcal.com</div>
              </div>
              <div className="text-muted small">
                Visiting Hours: 10:30 AM to 5:30 PM (Monday to Saturday) at Salt Lake Sector V Main Campus.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
