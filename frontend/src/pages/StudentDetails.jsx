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
        <h1>Student Details</h1>
        
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

        {/* Application Status Control */}
        <div className="card">
          <h3>Update Placement Status</h3>
          <form onSubmit={handleUpdateStatus}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={statusData.status} onChange={handleStatusChange}>
                  <option value="pending">Pending</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div className="form-group">
                <label>Interview Score (out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="interviewScore"
                  value={statusData.interviewScore}
                  onChange={handleStatusChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Feedback</label>
              <textarea
                name="feedback"
                value={statusData.feedback}
                onChange={handleStatusChange}
                rows="4"
                placeholder="Provide detailed feedback about the interview..."
              />
            </div>

            <div className="form-group">
              <label>Internal Notes</label>
              <textarea
                name="notes"
                value={statusData.notes}
                onChange={handleStatusChange}
                rows="3"
                placeholder="Internal notes for evaluation..."
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              style={{ width: '100%' }}
            >
              {saving ? 'Updating...' : 'Update Status'}
            </button>
          </form>
        </div>

        {/* Current Application Status */}
        {application && (
          <div className="card">
            <h3>Current Application Status</h3>
            <div className="grid grid-2">
              <div>
                <p><strong>Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                <p><strong>Current Status:</strong> 
                  <span 
                    className={`btn ${
                      application.status === 'selected' ? 'status-selected' : 
                      application.status === 'rejected' ? 'status-rejected' : 
                      'status-pending'
                    }`}
                    style={{ marginLeft: '10px', fontSize: '12px', padding: '4px 8px' }}
                  >
                    {application.status?.toUpperCase()}
                  </span>
                </p>
              </div>
              <div>
                {application.interviewScore && (
                  <p><strong>Score:</strong> {application.interviewScore}/100</p>
                )}
                {application.lastUpdated && (
                  <p><strong>Last Updated:</strong> {new Date(application.lastUpdated).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default StudentDetails;