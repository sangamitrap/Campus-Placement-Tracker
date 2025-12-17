import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EligibilityBanner = () => {
  const [profile, setProfile] = useState(null);
  const [eligibleJobs, setEligibleJobs] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const { isUser } = useAuth();

  useEffect(() => {
    if (isUser) {
      fetchEligibilityData();
    }
  }, [isUser]);

  const fetchEligibilityData = async () => {
    try {
      const [profileRes, jobsRes] = await Promise.all([
        axios.get('/api/users/profile', { withCredentials: true }),
        axios.get('/api/jobs', { withCredentials: true })
      ]);

      const userProfile = profileRes.data;
      const jobs = jobsRes.data;

      setProfile(userProfile);
      setTotalJobs(jobs.length);

      if (userProfile) {
        const eligible = jobs.filter(job => 
          userProfile.cgpa >= job.minCGPA &&
          userProfile.backlogs <= job.maxBacklogs &&
          job.eligibleDepartments.includes(userProfile.department)
        ).length;
        setEligibleJobs(eligible);
      }
    } catch (error) {
      console.error('Error fetching eligibility data:', error);
    }
  };

  if (!isUser || !profile) return null;

  const isProfileIncomplete = !profile.firstName || !profile.cgpa || !profile.department;
  
  return (
    <div style={{
      background: isProfileIncomplete ? '#ffc107' : '#007bff',
      color: isProfileIncomplete ? '#000' : '#fff',
      padding: '10px 20px',
      textAlign: 'center',
      fontSize: '14px',
      position: 'sticky',
      top: '70px',
      zIndex: 99,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {isProfileIncomplete ? (
        <span>⚠️ Complete your profile to see job eligibility alerts</span>
      ) : (
        <span>
          🎯 You are eligible for <strong>{eligibleJobs}</strong> out of <strong>{totalJobs}</strong> available jobs
          {eligibleJobs < totalJobs && (
            <span> • Improve CGPA or reduce backlogs to unlock more opportunities</span>
          )}
        </span>
      )}
    </div>
  );
};

export default EligibilityBanner;