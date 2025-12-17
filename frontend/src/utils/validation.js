export const validateEmail = (email) => {
  const seceEmailRegex = /^[a-zA-Z0-9._%+-]+@sece\.ac\.in$/;
  return seceEmailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const checkEligibility = (user, job) => {
  if (!user || !job) return false;
  
  const cgpaEligible = user.cgpa >= job.minCGPA;
  const backlogEligible = user.backlogs <= job.maxBacklogs;
  const deptEligible = job.eligibleDepartments.includes(user.department);
  
  return cgpaEligible && backlogEligible && deptEligible;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN');
};