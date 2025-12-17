import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const StudentDetails = () => {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  
  const [student, setStudent] = useState(null);
  const [application, setApplication] = useState(null);
  const [statusData, setStatusData] = useState({
    status: 'pending',
    interviewScore: '',
    feedback: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId, jobId]);

  const fetchStudentDetails = async () => {
    try {
      const [studentRes, applicationRes] = await Promise.all([
        axios.get(`/api/interviewer/student/${studentId}`, { withCredentials: true }),
        axios.get(`/api/interviewer/application/${studentId}/${jobId}`, { withCredentials: true })
      ]);
      
      setStudent(studentRes.data);
      setApplication(applicationRes.data);
      
      if (applicationRes.data) {
        setStatusData({
          status: applicationRes.data.status || 'pending',
          interviewScore: applicationRes.data.interviewScore || '',
          feedback: applicationRes.data.feedback || '',
          notes: applicationRes.data.notes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setStatusData({
      ...statusData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await axios.put(
        `/api/interviewer/update-status/${studentId}/${jobId}`,
        statusData,
        { withCredentials: true }
      );
      setMessage('Status updated successfully!');
      fetchStudentDetails(); // Refresh data
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingBottom: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Student Details</h1>
          <button 
            className="btn" 
            onClick={fetchStudentDetails}
            style={{ padding: '8px 16px', backgroundColor: '#17a2b8', color: 'white' }}
          >
            🔄 Refresh Data
          </button>
        </div>
        
        {message && (
          <div className={`card ${message.includes('success') ? 'status-selected' : 'status-rejected'}`}>
            {message}
          </div>
        )}

        {/* Student Information */}
        <div className="card">
          <h3>Student Information</h3>
          <div className="grid grid-2">
            <div>
              <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Register Number:</strong> {student.registerNumber}</p>
              <p><strong>Department:</strong> {student.department}</p>
              <p><strong>Section:</strong> {student.section}</p>
            </div>
            <div>
              <p><strong>CGPA:</strong> {student.cgpa}</p>
              <p><strong>Backlogs:</strong> {student.backlogs}</p>
              <p><strong>Internship Preference:</strong> {student.internshipPreference}</p>
              {student.linkedinUrl && (
                <p><strong>LinkedIn:</strong> 
                  <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                </p>
              )}
            </div>
          </div>

          {student.skills && student.skills.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <p><strong>Skills:</strong></p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {student.skills.map((skill, index) => (
                  <span 
                    key={index}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {student.areaOfInterest && student.areaOfInterest.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <p><strong>Area of Interest:</strong></p>
              <p>{student.areaOfInterest.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Interview Evaluation Section */}
        <div className="card">
          <h3>📋 Interview Evaluation & Status Update</h3>
          <form onSubmit={handleUpdateStatus}>
            {/* Status Selection */}
            <div className="card" style={{ backgroundColor: '#f8f9fa', margin: '15px 0' }}>
              <h4>📄 Application Status</h4>
              <div className="form-group">
                <label>Current Status:</label>
                <select 
                  name="status" 
                  value={statusData.status} 
                  onChange={handleStatusChange}
                  style={{ padding: '10px', fontSize: '16px', border: '2px solid #28a745', borderRadius: '6px' }}
                >
                  <option value="pending">🕰️ Pending Review</option>
                  <option value="selected">✅ Selected</option>
                  <option value="rejected">❌ Rejected</option>
                  <option value="on-hold">⏸️ On Hold</option>
                </select>
              </div>
            </div>

            {/* Interview Score Section */}
            <div className="card" style={{ backgroundColor: '#fff3cd', margin: '15px 0' }}>
              <h4>🏆 Interview Performance</h4>
              <div className="form-group">
                <label>Interview Score (0-100):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="interviewScore"
                  value={statusData.interviewScore}
                  onChange={handleStatusChange}
                  placeholder="Enter score out of 100"
                  style={{ padding: '10px', fontSize: '16px', border: '2px solid #ffc107', borderRadius: '6px' }}
                />
                {statusData.interviewScore && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ 
                      width: '100%', 
                      backgroundColor: '#e9ecef', 
                      borderRadius: '10px', 
                      height: '20px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${statusData.interviewScore}%`,
                        backgroundColor: statusData.interviewScore >= 70 ? '#28a745' : statusData.interviewScore >= 50 ? '#ffc107' : '#dc3545',
                        height: '100%',
                        borderRadius: '10px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', textAlign: 'center' }}>
                      Performance: {statusData.interviewScore >= 70 ? 'Excellent' : statusData.interviewScore >= 50 ? 'Good' : 'Needs Improvement'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="card" style={{ backgroundColor: '#d1ecf1', margin: '15px 0' }}>
              <h4>📝 Interview Feedback</h4>
              <div className="form-group">
                <label>Detailed Feedback for Student:</label>
                <textarea
                  name="feedback"
                  value={statusData.feedback}
                  onChange={handleStatusChange}
                  rows="5"
                  placeholder="Provide constructive feedback about the student's performance, strengths, and areas for improvement..."
                  style={{ padding: '12px', fontSize: '14px', border: '2px solid #17a2b8', borderRadius: '6px' }}
                />
              </div>
            </div>

            {/* Internal Notes Section */}
            <div className="card" style={{ backgroundColor: '#f8d7da', margin: '15px 0' }}>
              <h4>🗒️ Internal Notes (Private)</h4>
              <div className="form-group">
                <label>Internal Evaluation Notes:</label>
                <textarea
                  name="notes"
                  value={statusData.notes}
                  onChange={handleStatusChange}
                  rows="3"
                  placeholder="Private notes for internal use only - not visible to students..."
                  style={{ padding: '12px', fontSize: '14px', border: '2px solid #dc3545', borderRadius: '6px' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              style={{ 
                width: '100%', 
                padding: '15px', 
                fontSize: '18px', 
                fontWeight: 'bold',
                backgroundColor: saving ? '#6c757d' : '#007bff',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              {saving ? '🔄 Updating Status...' : '💾 Save Evaluation & Update Status'}
            </button>
          </form>
        </div>

        {/* Current Application Status */}
        {application && (
          <div className="card">
            <h3>📈 Current Application Overview</h3>
            <div className="grid grid-2">
              <div>
                <p><strong>📅 Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                <p><strong>📋 Current Status:</strong> 
                  <span 
                    className={`btn ${
                      application.status === 'selected' ? 'status-selected' : 
                      application.status === 'rejected' ? 'status-rejected' : 
                      'status-pending'
                    }`}
                    style={{ marginLeft: '10px', fontSize: '14px', padding: '6px 12px', fontWeight: 'bold' }}
                  >
                    {application.status === 'selected' ? '✅ SELECTED' :
                     application.status === 'rejected' ? '❌ REJECTED' :
                     application.status === 'on-hold' ? '⏸️ ON HOLD' :
                     '🕰️ PENDING'}
                  </span>
                </p>
              </div>
              <div>
                {application.interviewScore && (
                  <div>
                    <p><strong>🏆 Interview Score:</strong> {application.interviewScore}/100</p>
                    <div style={{ 
                      width: '100%', 
                      backgroundColor: '#e9ecef', 
                      borderRadius: '10px', 
                      height: '15px',
                      overflow: 'hidden',
                      marginTop: '5px'
                    }}>
                      <div style={{
                        width: `${application.interviewScore}%`,
                        backgroundColor: application.interviewScore >= 70 ? '#28a745' : application.interviewScore >= 50 ? '#ffc107' : '#dc3545',
                        height: '100%',
                        borderRadius: '10px'
                      }}></div>
                    </div>
                  </div>
                )}
                {application.lastUpdated && (
                  <p><strong>🔄 Last Updated:</strong> {new Date(application.lastUpdated).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            
            {application.feedback && (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #2196f3' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>📝 Current Feedback:</h4>
                <p style={{ margin: 0, lineHeight: '1.6' }}>{application.feedback}</p>
              </div>
            )}
            
            {application.notes && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '6px', border: '1px solid #ff9800' }}>
                <h5 style={{ margin: '0 0 5px 0', color: '#f57c00' }}>🗒️ Internal Notes:</h5>
                <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic' }}>{application.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default StudentDetails;