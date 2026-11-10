import React from 'react';

export default function Footer({ setCurrentPage, setAuthUser }) {
  return (
    <footer className="iem-footer mt-auto no-print">
      <div className="container">
        <div className="row g-4">
          {/* About IEM */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="iem-logo-badge" style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>IEM</div>
              <h5 className="text-white mb-0 fw-bold">IEM Kolkata</h5>
            </div>
            <p className="text-secondary small leading-relaxed">
              Institute of Engineering & Management (IEM) Kolkata is the premier private engineering and management college in West Bengal. Accredited with NAAC 'A' Grade and ranked among top NIRF colleges.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-secondary">NAAC 'A'</span>
              <span className="badge bg-secondary">NBA Accredited</span>
              <span className="badge bg-secondary">AICTE Approved</span>
              <span className="badge bg-secondary">MAKAUT Affiliated</span>
            </div>
          </div>

          {/* Campus Addresses */}
          <div className="col-lg-4 col-md-6">
            <h6>Campuses & Contact</h6>
            <div className="small text-secondary mb-2">
              <strong className="text-light">Main Campus (Salt Lake):</strong><br />
              Sector V, Salt Lake Electronics Complex, Kolkata, West Bengal 700091.
            </div>
            <div className="small text-secondary mb-2">
              <strong className="text-light">Gurukul Campus:</strong><br />
              Y-12, Block EP, Sector V, Salt Lake, Kolkata 700091.
            </div>
            <div className="small text-secondary">
              <i className="bi bi-telephone text-warning me-1"></i> Helpline: +91 33 2357 2995<br />
              <i className="bi bi-envelope text-warning me-1"></i> Email: admissions@iemcal.com
            </div>
          </div>

          {/* Quick Links & Portal Roles */}
          <div className="col-lg-2 col-md-6">
            <h6>Portal Navigation</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><button className="btn btn-link p-0 text-secondary text-decoration-none" onClick={() => setCurrentPage('home')}>Home Page</button></li>
              <li><button className="btn btn-link p-0 text-secondary text-decoration-none" onClick={() => setCurrentPage('register')}>Register as Applicant</button></li>
              <li><button className="btn btn-link p-0 text-secondary text-decoration-none" onClick={() => setCurrentPage('login')}>Applicant Login</button></li>
              <li>
                <button 
                  className="btn btn-link p-0 text-secondary text-decoration-none" 
                  onClick={() => {
                    setAuthUser({ role: 'applicant', name: 'Arindam Mukherjee', id: 'usr_01' });
                    setCurrentPage('applicant-dashboard');
                  }}
                >
                  Applicant Dashboard
                </button>
              </li>
              <li>
                <button 
                  className="btn btn-link p-0 text-secondary text-decoration-none" 
                  onClick={() => {
                    setAuthUser({ role: 'applicant', name: 'Arindam Mukherjee', id: 'usr_01' });
                    setCurrentPage('application-status');
                  }}
                >
                  Track Application
                </button>
              </li>
            </ul>
          </div>

          {/* Administration Access */}
          <div className="col-lg-2 col-md-6">
            <h6>Administrative</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><button className="btn btn-link p-0 text-secondary text-decoration-none" onClick={() => setCurrentPage('admin-login')}>Admin Login Portal</button></li>
              <li>
                <button 
                  className="btn btn-link p-0 text-warning text-decoration-none" 
                  onClick={() => {
                    setAuthUser({ role: 'admin', name: 'Admission Officer', id: 'adm_01' });
                    setCurrentPage('admin-dashboard');
                  }}
                >
                  <i className="bi bi-shield-lock me-1"></i> Admin Console
                </button>
              </li>
              <li>
                <button 
                  className="btn btn-link p-0 text-warning text-decoration-none" 
                  onClick={() => {
                    setAuthUser({ role: 'admin', name: 'Admission Officer', id: 'adm_01' });
                    setCurrentPage('application-verification');
                  }}
                >
                  <i className="bi bi-check2-circle me-1"></i> Verification Queue
                </button>
              </li>
              <li><button className="btn btn-link p-0 text-secondary text-decoration-none" onClick={() => setCurrentPage('forgot-password')}>Password Recovery</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="iem-footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
          <div>
            © 2026 Institute of Engineering & Management (IEM), Kolkata. All rights reserved.
          </div>
          <div className="mt-2 mt-md-0 text-secondary small">
            Designed for IEM Admissions Directorate • Built with React & Bootstrap
          </div>
        </div>
      </div>
    </footer>
  );
}
