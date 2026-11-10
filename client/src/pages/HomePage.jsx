import React from 'react';
import { INITIAL_PROGRAMS, IMPORTANT_NOTICES } from '../data/sampleData';

export default function HomePage({ setCurrentPage, setAuthUser }) {
  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="iem-hero text-center text-md-start">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge-gold mb-3 d-inline-block">
                <i className="bi bi-mortarboard-fill me-1"></i> Admissions 2026 - 2027
              </span>
              <h1 className="display-5 fw-bold text-white mb-3">
                Shape Your Future at <span style={{ color: 'var(--iem-gold)' }}>IEM Kolkata</span>
              </h1>
              <p className="lead text-light mb-4 opacity-90">
                Pioneering quality education in Engineering, Technology & Management since 1989. Ranked as the top private engineering institution in Eastern India with a consistent 100% placement record.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                <button 
                  className="btn btn-iem-primary btn-lg px-4"
                  onClick={() => setCurrentPage('register')}
                >
                  <i className="bi bi-pencil-fill me-2"></i> Apply for Admission
                </button>
                <button 
                  className="btn btn-outline-light btn-lg px-4"
                  onClick={() => setCurrentPage('login')}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i> Existing Applicant Login
                </button>
                <button 
                  className="btn btn-dark btn-lg px-4 text-warning border-warning"
                  onClick={() => {
                    setAuthUser({ role: 'admin', name: 'Admission Officer', id: 'adm_01' });
                    setCurrentPage('admin-dashboard');
                  }}
                >
                  <i className="bi bi-shield-check me-2"></i> Admin Portal
                </button>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-lg p-4 bg-white rounded-4 text-dark">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <h5 className="fw-bold mb-0 text-primary">
                    <i className="bi bi-bell-fill text-warning me-2"></i> Admission Updates
                  </h5>
                  <span className="badge bg-danger pulse">LIVE</span>
                </div>
                <div className="list-group list-group-flush mb-3">
                  {IMPORTANT_NOTICES.map(notice => (
                    <div key={notice.id} className="list-group-item px-0 py-2 border-0 border-bottom">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span><i className="bi bi-calendar3 me-1"></i> {notice.date}</span>
                        {notice.isNew && <span className="badge bg-success-subtle text-success">NEW</span>}
                      </div>
                      <div className="fw-semibold small text-dark">{notice.title}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-light p-3 rounded-3 text-center">
                  <div className="fw-bold text-dark small">WBJEE Code: <span className="text-primary">104</span> | JEE Main College Code: <span className="text-primary">IEM-KOL</span></div>
                  <div className="text-muted small">Admissions through WBJEE, JEE Main & IEMJEE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Highlights */}
      <section className="py-4 bg-white shadow-sm border-bottom">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <div className="display-6 fw-bold text-primary mb-1">35+</div>
              <div className="text-muted small text-uppercase fw-semibold">Years of Academic Excellence</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="display-6 fw-bold text-success mb-1">100%</div>
              <div className="text-muted small text-uppercase fw-semibold">Placement Track Record</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="display-6 fw-bold text-warning mb-1">₹72 LPA</div>
              <div className="text-muted small text-uppercase fw-semibold">Highest Placement Package</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="display-6 fw-bold text-danger mb-1">NAAC 'A'</div>
              <div className="text-muted small text-uppercase fw-semibold">Grade Accreditation</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Admission Journey */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill text-uppercase">Simple & Transparent</span>
            <h2 className="fw-bold mt-2" style={{ color: 'var(--iem-navy)' }}>Online Admission Process</h2>
            <p className="text-muted">Follow these simple steps to complete your enrollment at IEM Kolkata</p>
          </div>

          <div className="row g-4">
            {[
              { step: '01', title: 'Register Account', desc: 'Create your applicant profile using email and phone number.', icon: 'bi-person-badge', page: 'register' },
              { step: '02', title: 'Fill Application Form', desc: 'Provide academic scores (10th/12th/PCM) and entrance ranks.', icon: 'bi-ui-checks-grid', page: 'application-form' },
              { step: '03', title: 'Upload Documents', desc: 'Upload scanned copies of marksheets, rank card, photo and signature.', icon: 'bi-upload', page: 'document-upload' },
              { step: '04', title: 'Pay Application Fee', desc: 'Secure online payment of application fee via UPI, Cards, or Net Banking.', icon: 'bi-credit-card-2-front', page: 'payment' },
              { step: '05', title: 'Verification & Allotment', desc: 'Track document approval, rank cutoff, and download provisional seat letter.', icon: 'bi-patch-check', page: 'application-status' }
            ].map(item => (
              <div key={item.step} className="col-md-4 col-lg">
                <div className="iem-card h-100 p-4 text-center border-top border-4 border-primary">
                  <div className="display-6 fw-bold text-primary opacity-25 mb-2">{item.step}</div>
                  <div className="fs-2 text-primary mb-3"><i className={`bi ${item.icon}`}></i></div>
                  <h6 className="fw-bold mb-2">{item.title}</h6>
                  <p className="text-muted small mb-3">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Offered */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="badge bg-warning-subtle text-warning-emphasis fw-bold px-3 py-2 rounded-pill text-uppercase">Academic Programs</span>
              <h2 className="fw-bold mt-2" style={{ color: 'var(--iem-navy)' }}>Programs Offered for 2026-27</h2>
              <p className="text-muted mb-0">Undergraduate & Postgraduate Degree Programs at IEM</p>
            </div>
            <button 
              className="btn btn-outline-primary mt-3 mt-md-0"
              onClick={() => setCurrentPage('register')}
            >
              Apply to Any Program <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>

          <div className="row g-4">
            {INITIAL_PROGRAMS.map(prog => (
              <div key={prog.id} className="col-md-6 col-lg-4">
                <div className="iem-card h-100 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="p-3 rounded-3 bg-primary-subtle text-primary fs-3">
                        <i className={`bi ${prog.icon}`}></i>
                      </div>
                      <span className="badge bg-light text-dark border">{prog.category}</span>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">{prog.name}</h5>
                    <div className="small text-muted mb-3"><i className="bi bi-clock me-1"></i> {prog.duration}</div>
                    <div className="bg-light p-3 rounded-3 small mb-3">
                      <strong>Eligibility:</strong> {prog.eligibility}
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3 small">
                      <span className="text-muted">Total Intake: <strong>{prog.seats} Seats</strong></span>
                      <span className="badge bg-success-subtle text-success">{prog.filled} Applied</span>
                    </div>
                    <button 
                      className="btn btn-iem-primary w-100"
                      onClick={() => setCurrentPage('register')}
                    >
                      Apply for this Branch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-5 text-white" style={{ background: 'linear-gradient(135deg, #0a2240, #153e70)' }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Begin Your Engineering & Management Journey Today</h2>
          <p className="lead text-light mb-4 max-w-2xl mx-auto opacity-90">
            Admissions for Phase 1 are closing shortly. Register now to participate in document verification and merit counseling rounds.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button 
              className="btn btn-iem-primary btn-lg px-4"
              onClick={() => setCurrentPage('register')}
            >
              Start Online Application
            </button>
            <button 
              className="btn btn-outline-light btn-lg px-4"
              onClick={() => setCurrentPage('login')}
            >
              Applicant Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
