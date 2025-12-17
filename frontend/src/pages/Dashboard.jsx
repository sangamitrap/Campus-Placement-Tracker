import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import EligibilityBanner from '../components/EligibilityBanner';

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [notificationsRes, applicationsRes] = await Promise.all([
        axios.get('/api/notifications', { withCredentials: true }),
        axios.get('/api/applications/my-applications', { withCredentials: true })
      ]);
      
      setNotifications(notificationsRes.data);
      setApplications(applicationsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createQuickNotifications = async () => {
    try {
      await axios.post('/api/notifications/create-quick', {}, { withCredentials: true });
      fetchDashboardData(); // Refresh to show new notifications
    } catch (error) {
      console.error('Error creating notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`, {}, { withCredentials: true });
      fetchDashboardData(); // Refresh to update read status
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Student Dashboard</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-primary" 
              onClick={fetchDashboardData}
              style={{ padding: '8px 16px' }}
            >
              🔄 Refresh
            </button>
            <button 
              className="btn" 
              onClick={createQuickNotifications}
              style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white' }}
            >
              🔔 Add Alerts
            </button>
          </div>
        </div>
        
        <div className="grid grid-2">
          {/* Notifications Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>🔔 Notifications</h3>
              <small style={{ color: '#666' }}>({notifications.length} total)</small>
            </div>
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div key={notification._id} style={{ 
                    padding: '10px 0', 
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    backgroundColor: notification.isRead ? 'transparent' : '#f8f9fa'
                  }}
                  onClick={() => markNotificationAsRead(notification._id)}
                  >
                    <p style={{ margin: 0, fontSize: '14px' }}>{notification.message}</p>
                    <small style={{ color: '#666' }}>
                      {new Date(notification.createdAt).toLocaleDateString()}
                      {!notification.isRead && <span style={{ color: '#007bff', marginLeft: '10px' }}>• New</span>}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applied Jobs Status */}
          <div className="card">
            <h3>🧑‍💼 Applied Job Status</h3>
            {applications.length === 0 ? (
              <p>No applications yet</p>
            ) : (
              <div>
                {applications.slice(0, 5).map((application) => (
                  <div key={application._id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <p style={{ margin: 0, fontWeight: '500' }}>{application.job?.title}</p>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>{application.job?.company}</p>
                    <span 
                      className={`btn ${
                        application.status === 'selected' ? 'status-selected' : 
                        application.status === 'rejected' ? 'status-rejected' : 
                        'status-pending'
                      }`}
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      {application.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3>📊 Quick Stats</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#007bff', margin: 0 }}>{applications.length}</h2>
                <p style={{ margin: 0, fontSize: '14px' }}>Total Applied</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#28a745', margin: 0 }}>
                  {applications.filter(app => app.status === 'selected').length}
                </h2>
                <p style={{ margin: 0, fontSize: '14px' }}>Selected</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#ffc107', margin: 0 }}>
                  {applications.filter(app => app.status === 'pending').length}
                </h2>
                <p style={{ margin: 0, fontSize: '14px' }}>Pending</p>
              </div>
            </div>
          </div>

          {/* Eligibility Alerts */}
          <div className="card">
            <h3>🎯 Eligibility Alerts</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Complete your profile to see personalized job recommendations based on your CGPA, department, and skills.
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;