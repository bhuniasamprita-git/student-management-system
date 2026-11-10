import React, { useState } from 'react';

export default function AdminDashboardPage({ 
  applicantsList, 
  setSelectedApplicantId, 
  setCurrentPage 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');

  // Filter applicants
  const filteredApplicants = applicantsList.filter(app => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || app.preferences?.[0]?.course === branchFilter;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  const handleOpenVerification = (appId) => {
    setSelectedApplicantId(appId);
    setCurrentPage('application-verification');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="badge bg-success-subtle text-success">Verified</span>;
      case 'seat_allotted':
        return <span className="badge bg-primary-subtle text-primary">Seat Allotted</span>;
      case 'under_review':
        return <span className="badge bg-warning-subtle text-warning-emphasis">Under Review</span>;
      case 'correction_required':
        return <span className="badge bg-danger-subtle text-danger">Correction Needed</span>;
      default:
        return <span className="badge bg-info-subtle text-info-emphasis">Submitted</span>;
    }
  };

  return (
    <div className="py-4" style={{ backgroundColor: '#f1f5f9', minHeight: '85vh' }}>
      <div className="container-fluid px-lg-5">
        {/* Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h3 className="fw-bold mb-0 text-dark">
              <i className="bi bi-kanban text-primary me-2"></i> IEM Central Admission Directorate
            </h3>
            <p className="text-muted small mb-0">Overview of candidate registrations, scrutiny, and seat allotment</p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => alert('Exporting candidate list to CSV format...')}
            >
              <i className="bi bi-download me-1"></i> Export Roster (CSV)
            </button>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => {
                setSelectedApplicantId(applicantsList[0]?.id || 'usr_01');
                setCurrentPage('application-verification');
              }}
            >
              <i className="bi bi-shield-check me-1"></i> Open Verification Queue
            </button>
          </div>
        </div>

        {/* Analytics Counters */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg">
            <div className="iem-card p-3 border-start border-4 border-primary">
              <div className="text-muted small text-uppercase fw-semibold">Total Applicants</div>
              <div className="fs-3 fw-bold text-dark mt-1">1,248</div>
              <div className="small text-success"><i className="bi bi-arrow-up"></i> +14 today</div>
            </div>
          </div>
          <div className="col-6 col-lg">
            <div className="iem-card p-3 border-start border-4 border-warning">
              <div className="text-muted small text-uppercase fw-semibold">Under Scrutiny</div>
              <div className="fs-3 fw-bold text-warning mt-1">184</div>
              <div className="small text-muted">Awaiting document check</div>
            </div>
          </div>
          <div className="col-6 col-lg">
            <div className="iem-card p-3 border-start border-4 border-success">
              <div className="text-muted small text-uppercase fw-semibold">Verified Clear</div>
              <div className="fs-3 fw-bold text-success mt-1">892</div>
              <div className="small text-muted">Eligible for merit list</div>
            </div>
          </div>
          <div className="col-6 col-lg">
            <div className="iem-card p-3 border-start border-4 border-info">
              <div className="text-muted small text-uppercase fw-semibold">Seats Allotted</div>
              <div className="fs-3 fw-bold text-info mt-1">420</div>
              <div className="small text-muted">Round 1 Allotments</div>
            </div>
          </div>
          <div className="col-6 col-lg">
            <div className="iem-card p-3 border-start border-4 border-secondary">
              <div className="text-muted small text-uppercase fw-semibold">Fees Collected</div>
              <div className="fs-3 fw-bold text-dark mt-1">₹12.48 L</div>
              <div className="small text-success">100% Reconciliation</div>
            </div>
          </div>
        </div>

        {/* Branch Occupancy & Quick Filter Row */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="iem-card p-4 h-100">
              <h6 className="fw-bold text-dark mb-3">
                <i className="bi bi-pie-chart text-primary me-2"></i> Branch Intake Quota
              </h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>B.Tech CSE</span>
                  <span className="fw-bold">142 / 180 (79%)</span>
                </div>
                <div className="progress" style={{ height: '7px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '79%' }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>B.Tech CSE (AI & ML)</span>
                  <span className="fw-bold">110 / 120 (92%)</span>
                </div>
                <div className="progress" style={{ height: '7px' }}>
                  <div className="progress-bar bg-warning" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>B.Tech IT</span>
                  <span className="fw-bold">98 / 120 (81%)</span>
                </div>
                <div className="progress" style={{ height: '7px' }}>
                  <div className="progress-bar bg-info" style={{ width: '81%' }}></div>
                </div>
              </div>

              <div className="mb-0">
                <div className="d-flex justify-content-between small mb-1">
                  <span>B.Tech ECE</span>
                  <span className="fw-bold">85 / 120 (71%)</span>
                </div>
                <div className="progress" style={{ height: '7px' }}>
                  <div className="progress-bar bg-success" style={{ width: '71%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="iem-card p-4 h-100">
              <h6 className="fw-bold text-dark mb-3">
                <i className="bi bi-funnel text-primary me-2"></i> Applicant Filter & Search
              </h6>
              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label small fw-semibold">Search Applicant</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Name, App ID, Email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Status Filter</label>
                  <select 
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="verified">Verified</option>
                    <option value="seat_allotted">Seat Allotted</option>
                    <option value="correction_required">Correction Required</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Branch Filter</label>
                  <select 
                    className="form-select"
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                  >
                    <option value="all">All Preferred Branches</option>
                    <option value="B.Tech - Computer Science & Engineering">B.Tech CSE</option>
                    <option value="B.Tech - CSE (AI & Machine Learning)">B.Tech CSE (AI & ML)</option>
                    <option value="B.Tech - Information Technology">B.Tech IT</option>
                    <option value="B.Tech - Electronics & Communication">B.Tech ECE</option>
                    <option value="B.Tech - Electrical Engineering">B.Tech EE</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applicant Management Table */}
        <div className="iem-card overflow-hidden">
          <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
            <h6 className="fw-bold text-dark mb-0">
              <i className="bi bi-people-fill text-primary me-2"></i> Registered Candidates ({filteredApplicants.length})
            </h6>
            <span className="text-muted small">Click "Review" on any candidate to inspect files and allot seats</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Application No</th>
                  <th>Candidate Name</th>
                  <th>Contact</th>
                  <th>12th PCM %</th>
                  <th>Entrance Rank</th>
                  <th>1st Priority Choice</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map(app => (
                  <tr key={app.id}>
                    <td className="fw-bold text-primary font-monospace">{app.applicationNumber}</td>
                    <td>
                      <div className="fw-semibold text-dark">{app.fullName}</div>
                      <div className="text-muted small">{app.category} • {app.gender}</div>
                    </td>
                    <td>
                      <div>{app.phone}</div>
                      <div className="text-muted small">{app.email}</div>
                    </td>
                    <td>
                      <span className="fw-bold">{app.academics?.class12?.pcmPercentage || '-'}%</span>
                    </td>
                    <td>
                      <div>
                        <span className="badge bg-light text-dark border">
                          {app.academics?.entranceExam?.examType}
                        </span>
                      </div>
                      <div className="fw-bold text-success">Rank {app.academics?.entranceExam?.rank}</div>
                    </td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '180px' }}>
                        {app.preferences?.[0]?.course || 'B.Tech'}
                      </span>
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary py-1 px-3"
                        onClick={() => handleOpenVerification(app.id)}
                      >
                        <i className="bi bi-pencil-square me-1"></i> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
