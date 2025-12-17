# Placement Portal - Backend

Express.js backend with MongoDB for the placement management system with JWT authentication and role-based access control.

## 🚀 Quick Start

```bash
cd backend
npm install
npm run dev
```

## 📁 Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User profile management
│   ├── jobController.js     # Job management
│   ├── applicationController.js # Application handling
│   ├── interviewerController.js # Interviewer features
│   └── notificationController.js # Notifications
├── middleware/
│   └── auth.js              # JWT & role-based auth
├── models/
│   ├── User.js              # User schema
│   ├── Job.js               # Job schema
│   ├── Application.js       # Application schema
│   └── Notification.js      # Notification schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── users.js             # User routes
│   ├── jobs.js              # Job routes
│   ├── applications.js      # Application routes
│   ├── interviewer.js       # Interviewer routes
│   └── notifications.js     # Notification routes
├── utils/
│   └── jwt.js               # JWT utilities
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json
```

## 🔐 Security Features

- **JWT Authentication**: Access & refresh tokens
- **Role-based Access**: User/Interviewer permissions
- **Email Validation**: @sece.ac.in domain restriction
- **Eligibility Checking**: Server-side validation
- **Password Hashing**: bcrypt encryption

## 📊 Database Models

### User
- Student & Interviewer profiles
- Academic details (CGPA, backlogs, department)
- Skills and interests

### Job
- Job postings with eligibility criteria
- Company details and requirements
- Applicant tracking

### Application
- Student job applications
- Status tracking and feedback
- Interview scores

### Notification
- User alerts and updates
- Job postings and status changes

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users (Students)
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (Interviewer only)
- `GET /api/jobs/:id` - Get job details

### Applications
- `POST /api/applications/apply/:jobId` - Apply to job
- `GET /api/applications/my-applications` - Get user applications
- `PUT /api/applications/update-status/:studentId/:jobId` - Update status (Interviewer only)

### Interviewer
- `GET /api/interviewer/jobs` - Get interviewer's jobs
- `GET /api/interviewer/students` - Get students with filters
- `GET /api/interviewer/student/:studentId` - Get student details
- `GET /api/interviewer/application/:studentId/:jobId` - Get application details

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

## 🔧 Environment Setup

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement_portal
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
NODE_ENV=development
```

## 🚦 Middleware

### Authentication
- Token verification
- User role checking
- Email domain validation

### Authorization
- Role-based route protection
- Resource access control

## 📈 Features Implemented

✅ **User Management**
- Student registration with @sece.ac.in validation
- Interviewer registration with company details
- Profile management with academic info

✅ **Job System**
- Job posting by interviewers
- Eligibility-based job filtering
- Application tracking

✅ **Application Flow**
- Eligibility checking before application
- Status updates by interviewers
- Feedback and scoring system

✅ **Security**
- JWT-based authentication
- Role-based access control
- Input validation and sanitization

✅ **Notifications**
- User alerts for job updates
- Status change notifications

## 🔄 Data Flow

1. **Registration**: Email validation → Password hashing → JWT generation
2. **Job Application**: Eligibility check → Application creation → Notification
3. **Status Update**: Interviewer input → Database update → Student notification
4. **Profile Update**: Validation → Database update → Response

## 🧪 Testing

Start MongoDB and run:
```bash
npm run dev
```

Test endpoints with tools like Postman or curl.

## 🚀 Production Deployment

1. Set production environment variables
2. Use process manager (PM2)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Configure MongoDB Atlas for cloud database

## 📝 Notes

- All routes require authentication except auth endpoints
- Role-based access enforced at middleware level
- Eligibility checking happens both frontend and backend
- JWT tokens stored as httpOnly cookies for security