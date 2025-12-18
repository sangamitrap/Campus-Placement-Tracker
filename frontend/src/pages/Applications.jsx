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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>📋 My Applications</h1>
          <button 
            className="btn btn-primary" 
            onClick={fetchApplications}
            style={{ padding: '8px 16px' }}
          >
            🔄 Refresh
          </button>
        </div>
        
        {applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3>📭 No Applications Yet</h3>
            <p>You haven't applied to any jobs yet. Browse available jobs to get started!</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/jobs'}
              style={{ marginTop: '15px' }}
            >
              💼 Browse Jobs
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {applications.map((application) => (
              <div key={application._id} className="card" style={{ 
                border: '2px solid #ecf0f1', 
                borderRadius: '12px',
                padding: '25px',
                backgroundColor: '#fdfdfd'
              }}>
                <div className="grid grid-2">
                  {/* Job Details */}
                  <div>
                    <h3 style={{ color: '#2c3e50', margin: '0 0 15px 0' }}>
                      💼 {application.job?.title}
                    </h3>
                    <p><strong>🏢 Company:</strong> {application.job?.company}</p>
                    <p><strong>📍 Location:</strong> {application.job?.location}</p>
                    <p><strong>💰 Package:</strong> {application.job?.package}</p>
                    <p><strong>📅 Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                  </div>
                  
                  {/* Status & Score */}
                  <div>
                    <div style={{ marginBottom: '15px' }}>
                      <span 
                        className={`btn ${
                          application.status === 'selected' ? 'status-selected' : 
                          application.status === 'rejected' ? 'status-rejected' : 
                          'status-pending'
                        }`}
                        style={{ fontSize: '16px', padding: '10px 20px', fontWeight: 'bold' }}
                      >
                        {application.status === 'selected' ? '✅ SELECTED' :
                         application.status === 'rejected' ? '❌ REJECTED' :
                         application.status === 'on-hold' ? '⏸️ ON HOLD' :
                         '⏳ PENDING REVIEW'}
                      </span>
                    </div>

                    {application.interviewScore && (
                      <div style={{ marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#8e44ad' }}>🏆 Interview Score</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ 
                            width: '100px', 
                            backgroundColor: '#e9ecef', 
                            borderRadius: '10px', 
                            height: '20px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${application.interviewScore}%`,
                              backgroundColor: application.interviewScore >= 70 ? '#27ae60' : application.interviewScore >= 50 ? '#f39c12' : '#e74c3c',
                              height: '100%',
                              borderRadius: '10px'
                            }}></div>
                          </div>
                          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                            {application.interviewScore}/100
                          </span>
                        </div>
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#7f8c8d' }}>
                          Performance: {application.interviewScore >= 70 ? 'Excellent 🎆' : application.interviewScore >= 50 ? 'Good 😊' : 'Needs Improvement 💪'}
                        </p>
                      </div>
                    )}

                    {application.lastUpdated && (
                      <p style={{ fontSize: '12px', color: '#95a5a6' }}>
                        🔄 Last Updated: {new Date(application.lastUpdated).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Feedback Section */}
                {application.feedback && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '20px', 
                    backgroundColor: application.status === 'selected' ? '#d5f4e6' : application.status === 'rejected' ? '#ffeaa7' : '#dff9fb', 
                    borderRadius: '10px',
                    border: `2px solid ${application.status === 'selected' ? '#27ae60' : application.status === 'rejected' ? '#f39c12' : '#74b9ff'}`
                  }}>
                    <h4 style={{ 
                      margin: '0 0 10px 0', 
                      color: application.status === 'selected' ? '#27ae60' : application.status === 'rejected' ? '#e17055' : '#0984e3'
                    }}>
                      💬 Interviewer Feedback
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '15px', 
                      lineHeight: '1.6',
                      color: '#2d3436'
                    }}>
                      {application.feedback}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  {application.status === 'selected' && (
                    <button 
                      className="btn"
                      style={{ backgroundColor: '#27ae60', color: 'white', padding: '8px 16px' }}
                    >
                      🎉 Congratulations!
                    </button>
                  )}
                  {application.status === 'pending' && (
                    <button 
                      className="btn"
                      style={{ backgroundColor: '#f39c12', color: 'white', padding: '8px 16px' }}
                    >
                      ⏳ Awaiting Review
                    </button>
                  )}
                  {application.status === 'rejected' && (
                    <button 
                      className="btn"
                      onClick={() => window.location.href = '/jobs'}
                      style={{ backgroundColor: '#74b9ff', color: 'white', padding: '8px 16px' }}
                    >
                      🔍 Find More Jobs
                    </button>
                  )}
                </div>
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