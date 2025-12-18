import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const InterviewerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, selected: 0, rejected: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedJob, selectedStatus]);

  const fetchDashboardData = async () => {
    try {
      const jobsResponse = await axios.get('/api/interviewer/jobs', { withCredentials: true });
      setJobs(jobsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedJob) params.append('jobId', selectedJob);
      if (selectedStatus) params.append('status', selectedStatus);
      
      const response = await axios.get(`/api/interviewer/applications?${params}`, { withCredentials: true });
      setApplications(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const pending = response.data.filter(app => app.status === 'pending').length;
      const selected = response.data.filter(app => app.status === 'selected').length;
      const rejected = response.data.filter(app => app.status === 'rejected').length;
      setStats({ total, pending, selected, rejected });
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const quickUpdateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(`/api/interviewer/quick-update/${applicationId}`, 
        { status: newStatus }, 
        { withCredentials: true }
      );
      fetchApplications(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.student.firstName.toLowerCase().includes(searchLower) ||
        app.student.lastName.toLowerCase().includes(searchLower) ||
        app.student.registerNumber.toLowerCase().includes(searchLower) ||
        app.student.department.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>🎯 Interviewer Dashboard</h1>
          <p style={{ color: '#7f8c8d', fontSize: '18px' }}>Manage Applications & Evaluate Candidates</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-4" style={{ marginBottom: '30px' }}>
          <div className="card" style={{ textAlign: 'center', backgroundColor: '#3498db', color: 'white' }}>
            <h2 style={{ margin: '0 0 5px 0' }}>{stats.total}</h2>
            <p style={{ margin: 0 }}>📋 Total Applications</p>
          </div>
          <div className="card" style={{ textAlign: 'center', backgroundColor: '#f39c12', color: 'white' }}>
            <h2 style={{ margin: '0 0 5px 0' }}>{stats.pending}</h2>
            <p style={{ margin: 0 }}>⏳ Pending Review</p>
          </div>
          <div className="card" style={{ textAlign: 'center', backgroundColor: '#27ae60', color: 'white' }}>
            <h2 style={{ margin: '0 0 5px 0' }}>{stats.selected}</h2>
            <p style={{ margin: 0 }}>✅ Selected</p>
          </div>
          <div className="card" style={{ textAlign: 'center', backgroundColor: '#e74c3c', color: 'white' }}>
            <h2 style={{ margin: '0 0 5px 0' }}>{stats.rejected}</h2>
            <p style={{ margin: 0 }}>❌ Rejected</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="card">
          <h3>🔍 Filter Applications</h3>
          <div className="grid grid-3">
            <div className="form-group">
              <label>Job Position:</label>
              <select 
                value={selectedJob} 
                onChange={(e) => setSelectedJob(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '2px solid #3498db' }}
              >
                <option value="">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} - {job.company}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Application Status:</label>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '2px solid #27ae60' }}
              >
                <option value="">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="selected">✅ Selected</option>
                <option value="rejected">❌ Rejected</option>
                <option value="on-hold">⏸️ On Hold</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Search Student:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, Register No, Department..."
                style={{ padding: '10px', borderRadius: '6px', border: '2px solid #f39c12' }}
              />
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>📋 Applications ({filteredApplications.length})</h3>
            <button 
              className="btn" 
              onClick={fetchApplications}
              style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white' }}
            >
              🔄 Refresh
            </button>
          </div>
          
          {filteredApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
              <h3>📭 No Applications Found</h3>
              <p>No applications match your current filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filteredApplications.map((application) => (
                <div key={application._id} className="card" style={{ 
                  border: '2px solid #ecf0f1', 
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: '#fdfdfd'
                }}>
                  <div className="grid grid-3">
                    {/* Student Info */}
                    <div>
                      <h4 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>
                        👤 {application.student.firstName} {application.student.lastName}
                      </h4>
                      <p><strong>📝 Reg No:</strong> {application.student.registerNumber}</p>
                      <p><strong>🏫 Dept:</strong> {application.student.department} - {application.student.section}</p>
                      <p><strong>📊 CGPA:</strong> {application.student.cgpa} | <strong>📚 Backlogs:</strong> {application.student.backlogs}</p>
                    </div>
                    
                    {/* Job Info */}
                    <div>
                      <h4 style={{ color: '#8e44ad', margin: '0 0 10px 0' }}>
                        💼 {application.job.title}
                      </h4>
                      <p><strong>🏢 Company:</strong> {application.job.company}</p>
                      <p><strong>📅 Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                      {application.interviewScore && (
                        <p><strong>🏆 Score:</strong> {application.interviewScore}/100</p>
                      )}
                    </div>
                    
                    {/* Status & Actions */}
                    <div>
                      <div style={{ marginBottom: '15px' }}>
                        <span 
                          className={`btn ${
                            application.status === 'selected' ? 'status-selected' : 
                            application.status === 'rejected' ? 'status-rejected' : 
                            'status-pending'
                          }`}
                          style={{ fontSize: '14px', padding: '6px 12px', fontWeight: 'bold' }}
                        >
                          {application.status === 'selected' ? '✅ SELECTED' :
                           application.status === 'rejected' ? '❌ REJECTED' :
                           application.status === 'on-hold' ? '⏸️ ON HOLD' :
                           '⏳ PENDING'}
                        </span>
                      </div>
                      
                      {/* Quick Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => window.location.href = `/interviewer/student/${application.student._id}?jobId=${application.job._id}`}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          📋 Review & Rate
                        </button>
                        
                        <button 
                          className="btn"
                          onClick={() => window.location.href = `/interviewer/messages?studentId=${application.student._id}`}
                          style={{ backgroundColor: '#27ae60', color: 'white', fontSize: '12px', padding: '6px 12px' }}
                        >
                          💬 Message
                        </button>
                        
                        {application.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button 
                              className="btn"
                              onClick={() => quickUpdateStatus(application._id, 'selected')}
                              style={{ backgroundColor: '#27ae60', color: 'white', fontSize: '10px', padding: '4px 8px', flex: 1 }}
                            >
                              ✅ Select
                            </button>
                            <button 
                              className="btn"
                              onClick={() => quickUpdateStatus(application._id, 'rejected')}
                              style={{ backgroundColor: '#e74c3c', color: 'white', fontSize: '10px', padding: '4px 8px', flex: 1 }}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {application.feedback && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '6px' }}>
                      <strong>💬 Feedback:</strong> {application.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default InterviewerDashboard;