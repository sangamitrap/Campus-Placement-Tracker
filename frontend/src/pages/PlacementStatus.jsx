import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const PlacementStatus = () => {
  const [searchData, setSearchData] = useState({
    registerNumber: '',
    department: '',
    section: '',
    company: ''
  });
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlacementData(null);

    try {
      const response = await axios.post('/api/placement-status/search', searchData, { withCredentials: true });
      setPlacementData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'No placement data found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingBottom: '80px' }}>
        <h1>Placement Status & Feedback</h1>
        
        <div className="card">
          <h3>Search Placement Status</h3>
          <form onSubmit={handleSearch}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Register Number</label>
                <input
                  type="text"
                  name="registerNumber"
                  value={searchData.registerNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select name="department" value={searchData.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>

              <div className="form-group">
                <label>Section</label>
                <select name="section" value={searchData.section} onChange={handleChange} required>
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div className="form-group">
                <label>Company Applied For</label>
                <input
                  type="text"
                  name="company"
                  value={searchData.company}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Searching...' : 'Search Status'}
            </button>
          </form>
        </div>

        {error && (
          <div className="card status-rejected">
            <p>{error}</p>
          </div>
        )}

        {placementData && (
          <div className="card">
            <h3>Placement Details</h3>
            <div className="grid grid-2">
              <div>
                <p><strong>Student Name:</strong> {placementData.studentName}</p>
                <p><strong>Register Number:</strong> {placementData.registerNumber}</p>
                <p><strong>Department:</strong> {placementData.department}</p>
                <p><strong>Section:</strong> {placementData.section}</p>
              </div>
              <div>
                <p><strong>Company:</strong> {placementData.company}</p>
                <p><strong>Job Role:</strong> {placementData.jobRole}</p>
                <p><strong>Interview Date:</strong> {new Date(placementData.interviewDate).toLocaleDateString()}</p>
                <div style={{ marginTop: '10px' }}>
                  <span 
                    className={`btn ${
                      placementData.status === 'selected' ? 'status-selected' : 
                      placementData.status === 'rejected' ? 'status-rejected' : 
                      'status-pending'
                    }`}
                  >
                    {placementData.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {placementData.interviewScore && (
              <div style={{ marginTop: '20px' }}>
                <h4>Interview Score</h4>
                <p style={{ fontSize: '24px', color: '#007bff', fontWeight: 'bold' }}>
                  {placementData.interviewScore}/100
                </p>
              </div>
            )}

            {placementData.feedback && (
              <div style={{ marginTop: '20px' }}>
                <h4>Interviewer Feedback</h4>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '4px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ margin: 0, lineHeight: '1.5' }}>{placementData.feedback}</p>
                </div>
                {placementData.feedbackBy && (
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                    Feedback by: {placementData.feedbackBy}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default PlacementStatus;