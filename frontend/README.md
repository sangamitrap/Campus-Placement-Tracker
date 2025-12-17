# Placement Portal - Frontend

A React-based frontend for the MERN stack placement management system with role-based authentication and comprehensive student-interviewer interaction features.

## 🚀 Features

### Student Features
- **Secure Registration**: Only @sece.ac.in email domains allowed
- **Dashboard**: Notifications, application status, quick stats
- **Job Browsing**: Advanced filtering with eligibility checking
- **Profile Management**: Comprehensive student profile with skills, CGPA, etc.
- **Application Tracking**: View applied jobs with status and feedback
- **Placement Status**: Search placement results with interviewer feedback

### Interviewer Features
- **Dashboard**: View and filter applied students
- **Student Management**: Detailed student profiles and evaluation
- **Status Control**: Update placement status, scores, and feedback
- **Advanced Filtering**: Filter students by CGPA, department, skills

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx          # Role-based bottom navigation
│   │   ├── Navbar.jsx             # Top navigation with logout
│   │   └── ProtectedRoute.jsx     # Route protection component
│   ├── context/
│   │   └── AuthContext.jsx        # Authentication state management
│   ├── pages/
│   │   ├── Login.jsx              # Login page
│   │   ├── Register.jsx           # Student registration
│   │   ├── InterviewerRegister.jsx # Interviewer registration
│   │   ├── Dashboard.jsx          # Student dashboard
│   │   ├── Jobs.jsx               # Job listings with filters
│   │   ├── Applications.jsx       # Student applications
│   │   ├── Profile.jsx            # Student profile management
│   │   ├── PlacementStatus.jsx    # Placement results search
│   │   ├── InterviewerDashboard.jsx # Interviewer dashboard
│   │   └── StudentDetails.jsx     # Student evaluation page
│   ├── styles/
│   │   └── index.css              # Global styles
│   ├── utils/
│   │   └── validation.js          # Validation utilities
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # Entry point
├── package.json
├── vite.config.js
└── index.html
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Setup
The frontend is configured to proxy API requests to `http://localhost:5000` in development mode via Vite config.

### API Integration
All API calls use axios with `withCredentials: true` for cookie-based authentication.

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Bottom navigation for mobile users
- Grid layouts for desktop

### Role-Based UI
- Different navigation for students vs interviewers
- Conditional rendering based on user roles
- Protected routes with automatic redirects

### Form Validation
- Frontend validation for email domains (@sece.ac.in)
- Real-time form validation with error messages
- Eligibility checking for job applications

## 🔐 Security Features

### Authentication
- JWT token management via httpOnly cookies
- Automatic token refresh handling
- Role-based route protection

### Validation
- Email domain restriction for students
- Frontend eligibility checks (backed by server validation)
- Input sanitization and validation

## 📱 User Experience

### Student Flow
1. Register with @sece.ac.in email
2. Complete profile with academic details
3. Browse jobs with eligibility indicators
4. Apply to eligible positions
5. Track application status
6. View placement results and feedback

### Interviewer Flow
1. Register with company details
2. View students who applied to their jobs
3. Filter students by various criteria
4. Evaluate students and update status
5. Provide scores and feedback

## 🎯 Key Components

### AuthContext
- Centralized authentication state
- Login/logout functionality
- Role-based access control

### ProtectedRoute
- Route-level security
- Role-based redirects
- Loading state management

### Validation Utils
- Email domain validation
- Eligibility checking logic
- Form validation helpers

## 🚦 Status Indicators

### Application Status
- **Pending**: Yellow background
- **Selected**: Green background
- **Rejected**: Red background
- **On Hold**: Orange background

### Eligibility Indicators
- Disabled apply buttons for ineligible jobs
- Clear eligibility criteria display
- Real-time eligibility checking

## 📊 Data Flow

1. **Authentication**: Login → JWT cookie → Role-based redirect
2. **Job Application**: Eligibility check → Apply → Status tracking
3. **Profile Management**: Form validation → API update → Success feedback
4. **Status Updates**: Interviewer input → API call → Student notification

## 🔄 State Management

### Context API Usage
- Authentication state
- User role management
- Loading states

### Local State
- Form data management
- Filter states
- UI interaction states

## 📈 Performance Optimizations

- Lazy loading for route components
- Efficient re-renders with proper key props
- Optimized API calls with proper error handling
- Responsive images and assets

## 🧪 Testing Considerations

### Manual Testing Checklist
- [ ] Student registration with valid/invalid emails
- [ ] Job application eligibility checking
- [ ] Role-based navigation and access
- [ ] Form validation and error handling
- [ ] Status updates and feedback display

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement approach

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Static File Serving
The build output can be served by any static file server or integrated with the Express backend for a unified deployment.

## 📝 API Endpoints Expected

The frontend expects the following API structure:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/jobs` - Get all jobs
- `POST /api/applications/apply/:jobId` - Apply to job
- `GET /api/applications/my-applications` - Get user applications
- `PUT /api/users/profile` - Update user profile
- `GET /api/interviewer/students` - Get students for interviewer
- `PUT /api/interviewer/update-status/:studentId/:jobId` - Update placement status

## 🎉 Next Steps

1. **Backend Integration**: Connect with Express.js API
2. **Real-time Features**: Add WebSocket for live notifications
3. **File Upload**: Implement resume upload functionality
4. **Advanced Filtering**: Add more sophisticated search options
5. **Analytics**: Add placement statistics and reporting