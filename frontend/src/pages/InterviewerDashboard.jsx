import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const InterviewerDashboard = () => {
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    minCGPA: '',
    skills: ''
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchStudentsForJob();
    }
  }, [selectedJob, filters]);

  useEffect(() => {
    // Auto-refresh every 30 seconds to get latest application updates
    const interval = setInterval(() => {
      if (selectedJob) {
        fetchStudentsForJob();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedJob]);

  const fetchDashboardData = async () => {
    try {
      const jobsResponse = await axios.get('/api/interviewer/jobs', { withCredentials: true });
      setJobs(jobsResponse.data);
      if (jobsResponse.data.length > 0) {
        setSelectedJob(jobsResponse.data[0]._id);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForJob = async () => {
    try {
      const params = new URLSearchParams({
        jobId: selectedJob,
        ...filters
      });
      
      const response = await axios.get(`/api/interviewer/students?${params}`, { withCredentials: true });
      setStudents(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingBottom: '80px' }}>
        <h1>Interviewer Dashboard</h1>
        
        {/* Job Selection */}
        <div className="card">
          <h3>📋 Select Job Role to Review Applications</h3>
          <div className="form-group">
            <label>Choose Job Position:</label>
            <select 
              value={selectedJob} 
              onChange={(e) => setSelectedJob(e.target.value)}
              style={{ width: '100%', padding: '12px', fontSize: '16px', border: '2px solid #007bff', borderRadius: '8px' }}
            >
              <option value="">-- Select a Job Position --</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} at {job.company} ({job.location})
                </option>
              ))}
            </select>
          </div>
          {selectedJob && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>✅ Job selected! Students who applied for this position will appear below.</p>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="card">
          <h3>Filter Students</h3>
          <div className="grid grid-3">
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={filters.department} onChange={handleFilterChange}>
                <option value="">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <div className="form-group">
              <label>Minimum CGPA</label>
              <input
                type="number"
                step="0.1"
                name="minCGPA"
                value={filters.minCGPA}
                onChange={handleFilterChange}
                placeholder="e.g., 7.5"
              />
            </div>

            <div className="form-group">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                placeholder="e.g., React, Python"
              />
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Applied Students ({students.length})</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {lastUpdated && (
                <small style={{ color: '#666' }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </small>
              )}
              <button 
                className="btn" 
                onClick={() => selectedJob && fetchStudentsForJob()}
                style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white' }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          {students.length === 0 ? (
            <p>No students found for the selected criteria.</p>
          ) : (
            <div className="grid grid-2">
              {students.map((student) => (
                <div key={student._id} className="card" style={{ margin: '10px 0' }}>
                  <h4>{student.firstName} {student.lastName}</h4>
                  <p><strong>Register No:</strong> {student.registerNumber}</p>
                  <p><strong>Department:</strong> {student.department} - {student.section}</p>
                  <p><strong>CGPA:</strong> {student.cgpa}</p>
                  <p><strong>Backlogs:</strong> {student.backlogs}</p>
                  
                  {student.skills && student.skills.length > 0 && (
                    <p><strong>Skills:</strong> {student.skills.join(', ')}</p>
                  )}
                  
                  {student.areaOfInterest && student.areaOfInterest.length > 0 && (
                    <p><strong>Interests:</strong> {student.areaOfInterest.join(', ')}</p>
                  )}
                  
                  {student.linkedinUrl && (
                    <p><strong>LinkedIn:</strong> 
                      <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        View Profile
                      </a>
                    </p>
                  )}

                  {/* Application Status Display */}
                  {student.applicationStatus && (
                    <div style={{ margin: '10px 0' }}>
                      <span 
                        className={`btn ${
                          student.applicationStatus === 'selected' ? 'status-selected' : 
                          student.applicationStatus === 'rejected' ? 'status-rejected' : 
                          'status-pending'
                        }`}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        {student.applicationStatus === 'selected' ? '✅ SELECTED' :
                         student.applicationStatus === 'rejected' ? '❌ REJECTED' :
                         student.applicationStatus === 'on-hold' ? '⏸️ ON HOLD' :
                         '🕰️ PENDING'}
                      </span>
                      {student.interviewScore && (
                        <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                          Score: {student.interviewScore}/100
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: '15px' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.href = `/interviewer/student/${student._id}?jobId=${selectedJob}`}
                      style={{ marginRight: '10px' }}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn"
                      onClick={() => window.location.href = `/interviewer/messages?studentId=${student._id}`}
                      style={{ backgroundColor: '#28a745', color: 'white' }}
                    >
                      Message
                    </button>
                  </div>
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