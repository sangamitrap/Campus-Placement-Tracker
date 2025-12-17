import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import EligibilityBanner from '../components/EligibilityBanner';

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    registerNumber: '',
    department: '',
    section: '',
    cgpa: '',
    backlogs: '',
    linkedinUrl: '',
    areaOfInterest: '',
    skills: '',
    internshipPreference: 'both'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile', { withCredentials: true });
      if (response.data) {
        setProfile({
          ...response.data,
          skills: response.data.skills?.join(', ') || '',
          areaOfInterest: response.data.areaOfInterest?.join(', ') || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const profileData = {
        ...profile,
        skills: profile.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        areaOfInterest: profile.areaOfInterest.split(',').map(area => area.trim()).filter(area => area),
        cgpa: parseFloat(profile.cgpa),
        backlogs: parseInt(profile.backlogs)
      };

      await axios.put('/api/users/profile', profileData, { withCredentials: true });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
        <h1>My Profile</h1>
        
        {message && (
          <div className={`card ${message.includes('success') ? 'status-selected' : 'status-rejected'}`}>
            {message}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Register Number</label>
                <input
                  type="text"
                  name="registerNumber"
                  value={profile.registerNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select name="department" value={profile.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science Engineering</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="EEE">Electrical & Electronics</option>
                  <option value="MECH">Mechanical Engineering</option>
                  <option value="CIVIL">Civil Engineering</option>
                </select>
              </div>

              <div className="form-group">
                <label>Section</label>
                <select name="section" value={profile.section} onChange={handleChange} required>
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div className="form-group">
                <label>CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={profile.cgpa}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Number of Backlogs</label>
                <input
                  type="number"
                  min="0"
                  name="backlogs"
                  value={profile.backlogs}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={profile.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Area of Interest (comma-separated)</label>
              <input
                type="text"
                name="areaOfInterest"
                value={profile.areaOfInterest}
                onChange={handleChange}
                placeholder="Web Development, Machine Learning, Data Science"
              />
            </div>

            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                rows="3"
                placeholder="JavaScript, Python, React, Node.js, MongoDB"
              />
            </div>

            <div className="form-group">
              <label>Internship Preference</label>
              <select name="internshipPreference" value={profile.internshipPreference} onChange={handleChange}>
                <option value="internship">Internship Only</option>
                <option value="fulltime">Full-time Only</option>
                <option value="both">Both</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              style={{ width: '100%' }}
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;