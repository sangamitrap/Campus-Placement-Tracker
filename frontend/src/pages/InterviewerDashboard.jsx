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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchStudentsForJob();
    }
  }, [selectedJob, filters]);

  const fetchDashboardData = async () => {
    try {
      const jobsResponse = await axios.get('/api/interviewer/jobs', { withCredentials: true });
      setJobs(jobsResponse.data);
      if (jobsResponse.data.length > 0) {
        setSelectedJob(jobsResponse.data[0]._id);
      }
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
          <h3>Select Job Role</h3>
          <select 
            value={selectedJob} 
            onChange={(e) => setSelectedJob(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          >
            <option value="">Select a job</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>
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
          <h3>Applied Students ({students.length})</h3>
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