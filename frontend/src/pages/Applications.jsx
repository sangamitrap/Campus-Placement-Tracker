import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import EligibilityBanner from '../components/EligibilityBanner';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications/my-applications', { withCredentials: true });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
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
        <h1>My Applications</h1>
        
        {applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>No Applications Yet</h3>
            <p>You haven't applied to any jobs yet. Browse available jobs to get started!</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {applications.map((application) => (
              <div key={application._id} className="card">
                <h3>{application.job?.title}</h3>
                <p><strong>Company:</strong> {application.job?.company}</p>
                <p><strong>Type:</strong> {application.job?.type}</p>
                <p><strong>Location:</strong> {application.job?.location}</p>
                <p><strong>Package:</strong> {application.job?.package}</p>
                <p><strong>Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                
                <div style={{ marginTop: '15px' }}>
                  <span 
                    className={`btn ${
                      application.status === 'selected' ? 'status-selected' : 
                      application.status === 'rejected' ? 'status-rejected' : 
                      'status-pending'
                    }`}
                    style={{ fontSize: '14px', padding: '8px 16px' }}
                  >
                    {application.status.toUpperCase()}
                  </span>
                </div>

                {application.interviewScore && (
                  <div style={{ marginTop: '10px' }}>
                    <p><strong>Interview Score:</strong> {application.interviewScore}/100</p>
                  </div>
                )}

                {application.feedback && (
                  <div style={{ marginTop: '10px' }}>
                    <p><strong>Feedback:</strong></p>
                    <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                      {application.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Applications;