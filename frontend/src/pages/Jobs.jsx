import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import EligibilityBanner from '../components/EligibilityBanner';
import { checkEligibility } from '../utils/validation';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    type: '',
    department: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(12);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset to first page when filters change
  }, [jobs, filters]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs', { withCredentials: true });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile', { withCredentials: true });
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (filters.company) {
      filtered = filtered.filter(job => 
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.role) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type);
    }

    if (filters.department) {
      filtered = filtered.filter(job => 
        job.eligibleDepartments.includes(filters.department)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentPageJobs = () => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(`/api/applications/apply/${jobId}`, {}, { withCredentials: true });
      alert('Application submitted successfully!');
      fetchJobs(); // Refresh to update application status
    } catch (error) {
      alert(error.response?.data?.message || 'Application failed');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <EligibilityBanner />
      <div className="container" style={{ paddingBottom: '80px' }}>
        <h1>Available Jobs</h1>
        
        {/* Filter Bar */}
        <div className="filter-bar">
          <input
            type="text"
            name="company"
            placeholder="Company name"
            value={filters.company}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Job role"
            value={filters.role}
            onChange={handleFilterChange}
          />
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="internship">Internship</option>
            <option value="fulltime">Full-time</option>
          </select>
          <select name="department" value={filters.department} onChange={handleFilterChange}>
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>

        {/* Jobs List */}
        <div className="grid grid-2">
          {getCurrentPageJobs().map((job) => {
            const isEligible = userProfile ? checkEligibility(userProfile, job) : false;
            const hasApplied = job.applicants?.includes(user?.id);
            
            return (
              <div key={job._id} className="card">
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Type:</strong> {job.type}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Package:</strong> {job.package}</p>
                <p><strong>Min CGPA:</strong> {job.minCGPA}</p>
                <p><strong>Max Backlogs:</strong> {job.maxBacklogs}</p>
                <p><strong>Departments:</strong> {job.eligibleDepartments.join(', ')}</p>
                <p><strong>Skills:</strong> {job.requiredSkills.join(', ')}</p>
                
                {job.description && (
                  <p><strong>Description:</strong> {job.description}</p>
                )}
                
                <div style={{ marginTop: '15px' }}>
                  {hasApplied ? (
                    <button className="btn" disabled style={{ backgroundColor: '#28a745', color: 'white' }}>
                      Applied ✓
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApply(job._id)}
                      disabled={!isEligible}
                      title={!isEligible ? 'You are not eligible for this job' : ''}
                    >
                      {isEligible ? 'Apply Now' : 'Not Eligible'}
                    </button>
                  )}
                  
                  {!isEligible && userProfile && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#dc3545' }}>
                      Eligibility criteria not met
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {filteredJobs.length > jobsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn"
            >
              Previous
            </button>
            
            <span style={{ margin: '0 15px' }}>
              Page {currentPage} of {Math.ceil(filteredJobs.length / jobsPerPage)} 
              ({filteredJobs.length} jobs)
            </span>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredJobs.length / jobsPerPage)))}
              disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
              className="btn"
            >
              Next
            </button>
          </div>
        )}

        {filteredJobs.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Jobs;