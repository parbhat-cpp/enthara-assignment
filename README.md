# Ethara - Project & Task Management Platform

A full-stack project and task management application built with modern web technologies. Users can create projects, manage team members, create tasks, assign them to team members, and track progress with status updates.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Setup & Installation](#setup--installation)
- [Local Development](#local-development)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Project Management
- **Create Projects** - Users can create new projects with name and description
- **Project Members** - Add/remove team members to projects
- **View Projects** - See all projects where user is creator or member
- **Delete Projects** - Project creators can delete projects

### Task Management
- **Create Tasks** - Add tasks to projects with title, description, priority, due date
- **Update Tasks** - Modify task details (admin and task creator only)
- **Task Status Tracking** - Track progress with statuses: To Do, In Progress, Done
- **Task Priority** - Set priority levels: Low, Medium, High
- **Task Assignment** - Assign tasks to project members (admin only)
- **Unassign Tasks** - Remove task assignments
- **View Tasks** - Users can only see tasks they created, are assigned to, or are project admin
- **Delete Tasks** - Task/project creators can delete tasks

### User Management
- **User Registration** - Sign up with email and password
- **User Login** - Secure login with JWT authentication
- **Password Security** - Passwords hashed with bcrypt
- **User Search** - Search users by email when adding members

### Access Control
- **Role-Based Access** - Different permissions for project creators, task creators, and team members
- **Task Permissions** - Members can only update their task status
- **Admin Controls** - Project creators have full task management control

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+
- **Routing**: TanStack Router (v1)
- **State Management**: TanStack Query v5 (data fetching & caching)
- **Form Handling**: TanStack React Form
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Type Safety**: TypeScript
- **Notifications**: React Hot Toast
- **HTTP Client**: Fetch API with credentials support

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Request Validation**: Zod
- **CORS**: Configured for cross-origin requests
- **Type Safety**: TypeScript
- **Dev Server**: Nodemon

### DevOps
- **Deployment**: Railway
- **Database Hosting**: MongoDB Atlas

## 📁 Project Structure

```
ethara-assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts # Auth endpoints
│   │   │   ├── project.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── middlewares/
│   │   │   └── is-auth.ts         # JWT verification
│   │   ├── models/
│   │   │   ├── users.model.ts
│   │   │   ├── project.model.ts
│   │   │   └── task.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   ├── project.types.ts
│   │   │   ├── task.types.ts
│   │   │   └── req.types.ts
│   │   └── index.ts               # Express app setup
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Reusable UI components
│   │   │   ├── TaskUpdateDialog.tsx
│   │   │   └── AddMemberDialog.tsx
│   │   ├── integrations/
│   │   │   └── tanstack-query/
│   │   ├── routes/
│   │   │   ├── __root.tsx         # Root layout
│   │   │   ├── index.tsx          # Login/Register
│   │   │   └── dashboard/
│   │   │       ├── index.tsx      # Projects list
│   │   │       └── project.$projectId.tsx
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── styles.css
│   │   └── router.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn
- Git
- MongoDB (local or MongoDB Atlas account)

## 📝 Setup & Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd ethara-assignment
```

### Step 2: Database Setup

#### Option A: Using MongoDB Atlas (Recommended for Production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a new project
4. Create a cluster (select free tier)
5. Create a database user with username and password
6. Get connection string in format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

#### Option B: Local MongoDB
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb

# Windows
# Download and install from https://www.mongodb.com/try/download/community
```

### Step 3: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# Copy from .env.example and fill in your values
cp .env.example .env

# Edit .env with your database URL and JWT secret
# See Environment Setup section below
```

### Step 4: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_NODE_ENV=development
VITE_BACKEND_URL=http://localhost:8080
EOF
```

## 🏗️ Local Development

### Terminal 1: Start Backend Server
```bash
cd backend
npm run dev
```
Expected output:
```
Server is running on port 8080
```

### Terminal 2: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Expected output:
```
Local: http://localhost:3000
```

### Access the Application
1. Open browser to `http://localhost:3000`
2. Sign up with a test account
3. Create a project
4. Add team members and tasks

### Available npm Scripts

**Backend:**
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled backend

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format and fix code
- `npm run check` - Check code formatting

## 🔧 Environment Setup

### Backend Configuration (.env)

Create `backend/.env`:
```env
# Environment
NODE_ENV=development

# Server Port
PORT=8080

# JWT Configuration
JWT_SECRET=your-super-secret-key-min-32-characters-for-production

# MongoDB Configuration
DB_URL=mongodb://localhost:27017/ethara
# OR for MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
DB_USER=your-db-username
DB_PASSWORD=your-db-password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration (.env)

Create `frontend/.env`:
```env
# Environment
VITE_NODE_ENV=development

# Backend API URL
VITE_BACKEND_URL=http://localhost:8080
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development`, `production` |
| `PORT` | Server port | `8080`, `5000` |
| `JWT_SECRET` | Secret for JWT signing | Min 32 characters, use strong random string |
| `DB_URL` | MongoDB connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:3000`, `https://app.example.com` |
| `VITE_NODE_ENV` | Frontend environment | `development`, `production` |
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:8080`, `https://api.example.com` |

### Generating JWT_SECRET

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL (Linux/Mac)
openssl rand -hex 32
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/login` | User login | ❌ |
| POST | `/signup` | User registration | ❌ |
| GET | `/user?email=example@email.com` | Search user by email | ✅ |

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Signup Request:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Project Routes (`/api/project`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/create` | Create new project | ✅ | Any |
| GET | `/get-all` | Get all user's projects | ✅ | Any |
| GET | `/get/:projectId` | Get project details | ✅ | Creator/Member |
| PATCH | `/add/:projectId/:userId` | Add member to project | ✅ | Creator |
| PATCH | `/remove/:projectId/:userId` | Remove member from project | ✅ | Creator |
| DELETE | `/delete/:projectId` | Delete project | ✅ | Creator |

**Create Project Request:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "members": ["userId1", "userId2"]
}
```

### Task Routes (`/api/task`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/create/:projectId` | Create task | ✅ | Creator |
| GET | `/all/:projectId` | Get project tasks | ✅ | Creator/Member/Assigned |
| GET | `/:taskId` | Get task details | ✅ | Creator/Assigned |
| PATCH | `/update/:projectId/:taskId` | Update task | ✅ | Creator/Assigned |
| PATCH | `/assign/:projectId/:taskId/:userId` | Assign task to user | ✅ | Creator |
| PATCH | `/unassign/:projectId/:taskId/:userId` | Unassign task from user | ✅ | Creator |
| DELETE | `/delete/:projectId/:taskId` | Delete task | ✅ | Creator |

**Create Task Request (Admin):**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "priority": "High",
  "dueDate": "2024-12-31",
  "assignedTo": ["userId1"]
}
```

**Update Task Request (Admin):**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "Medium",
  "dueDate": "2024-12-31",
  "status": "In Progress",
  "assignedTo": ["userId1", "userId2"]
}
```

**Update Task Request (Member):**
```json
{
  "status": "Done"
}
```

**Task Status Options:**
- `To Do`
- `In Progress`
- `Done`

**Priority Options:**
- `Low`
- `Medium`
- `High`

## 📊 Database Schema

### User Model
```typescript
{
  _id: ObjectId
  fullname: String (required)
  email: String (required, unique)
  password: String (hashed, required)
  createdAt: Date
  updatedAt: Date
}
```

### Project Model
```typescript
{
  _id: ObjectId
  name: String (required)
  description: String
  createdBy: ObjectId (User)
  members: [ObjectId] (User array)
  createdAt: Date
  updatedAt: Date
}
```

### Task Model
```typescript
{
  _id: ObjectId
  title: String (required)
  description: String (required)
  dueDate: Date (required)
  priority: String enum ['Low', 'Medium', 'High']
  status: String enum ['To Do', 'In Progress', 'Done']
  createdBy: ObjectId (User)
  assignedTo: [ObjectId] (User array)
  projectId: ObjectId (Project)
  createdAt: Date
  updatedAt: Date
}
```

## 🔐 Authentication Flow

1. **Registration**: User signs up → Password hashed with bcrypt → JWT token created
2. **Login**: User logs in → Password verified → JWT token issued
3. **Requests**: Token sent via HTTP-only cookie → Middleware verifies JWT
4. **Protected Routes**: Only accessible with valid JWT

## 🚢 Deployment

### Prerequisites for Railway
- Railway account ([Create here](https://railway.app))
- GitHub repository with your code
- MongoDB Atlas account for database

### Step-by-Step Railway Deployment

#### 1. Prepare Your Code
```bash
# Ensure both backend and frontend have build scripts
# Backend: package.json should have "build": "tsc"
# Frontend: package.json should have "build": "vite build"

# Ensure backend has start script
# Backend: package.json should have "start": "node dist/index.js"
```

#### 2. Push Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 3. Create Railway Project
1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize Railway with GitHub
5. Select your repository

#### 4. Deploy Backend Service
1. Click "Add Service" → "GitHub Repo"
2. Select your repository
3. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm run build && npm start`
   - **Runtime**: Node.js

#### 5. Add MongoDB Service
1. Click "Add Service" → "MongoDB"
2. Railway automatically provisions a MongoDB instance
3. Note the connection variables provided

#### 6. Configure Backend Environment Variables
In Railway Backend Service:
1. Go to **Variables** tab
2. Add the following:

```
NODE_ENV=production
PORT=8080
JWT_SECRET=<generate-secure-random-string>
DB_URL=<copy-from-MongoDB-service>
CORS_ORIGIN=https://<frontend-service-name>.up.railway.app
```

#### 7. Deploy Frontend Service
1. Click "Add Service" → "GitHub Repo"
2. Select your repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Runtime**: Node.js

#### 8. Configure Frontend Environment Variables
In Railway Frontend Service:
1. Go to **Variables** tab
2. Add:

```
VITE_NODE_ENV=production
VITE_BACKEND_URL=https://<backend-service-name>.up.railway.app
```

#### 9. Connect Services
1. Click on Backend service
2. In **Variables** tab, link to MongoDB service
3. Update `DB_URL` to use the connected MongoDB

### Production Deployment Checklist

- [ ] MongoDB Atlas or Railway MongoDB configured
- [ ] Backend environment variables set correctly
- [ ] Frontend environment variables set correctly
- [ ] `CORS_ORIGIN` matches frontend URL exactly
- [ ] `JWT_SECRET` is strong and random (32+ characters)
- [ ] Both services deployed successfully
- [ ] No build errors in Railway logs
- [ ] Application loads without errors
- [ ] Authentication works (login/signup)
- [ ] Projects and tasks can be created
- [ ] Cookies are being set (check DevTools)

## 📍 Post-Deployment

### Verify Deployment

1. **Check Service Status**
   - Go to Railway Dashboard
   - Verify both services show "Healthy"
   - Check build logs for errors

2. **Test Application**
   - Visit frontend URL
   - Create test account
   - Test all features:
     - Create project
     - Add members
     - Create task
     - Update task status
     - Assign/unassign tasks

3. **Check Logs**
   - Backend logs should show:
     ```
     Server is running on port 8080
     CORS Origin: https://...
     ```
   - Look for any error messages

4. **Verify Database**
   - MongoDB Atlas dashboard
   - Check data is being stored
   - Monitor connections

### Troubleshooting Production

**Service Won't Deploy:**
- Check build logs in Railway
- Verify `start` script exists in backend package.json
- Ensure all dependencies are in package.json (not devDependencies)

**401 Authentication Errors:**
- Check `CORS_ORIGIN` exactly matches frontend URL (no trailing slash)
- Verify `JWT_SECRET` is set in backend
- Clear browser cookies and re-login
- Check browser DevTools Network tab for cookie issues

**Cookie Not Being Set:**
- Ensure frontend URL uses HTTPS (Railway provides this)
- Verify `sameSite: 'none'` and `secure: true` in backend
- Check CORS has `credentials: true`
- Check `CORS_ORIGIN` is correct

**Database Connection Error:**
- Verify MongoDB service is running
- Check `DB_URL` in environment variables
- Verify credentials are correct
- Check IP whitelist if using MongoDB Atlas

### Monitoring & Maintenance

**Useful Railway Features:**
- **Metrics**: Monitor CPU, memory, network usage
- **Logs**: Real-time application logs
- **Network**: View incoming/outgoing requests
- **Environment**: Manage variables and secrets

**Regular Checks:**
- Monitor error rates in logs
- Check disk usage
- Review JWT secret rotation policy
- Update dependencies periodically

### Custom Domain (Optional)

1. In Railway service settings
2. Go to **Domain** tab
3. Click "Add Domain"
4. Enter your custom domain
5. Update DNS records at your domain provider
6. Wait for SSL certificate to issue

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": { /* error details */ }
}
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ HTTP-only cookies (prevents XSS)
- ✅ CORS protection
- ✅ Input validation with Zod
- ✅ Role-based access control
- ✅ Secure cookie settings (Secure, HttpOnly, SameSite)

## 📚 Key Features in Detail

### Role-Based Permissions

**Project Creators** can:
- Add/remove members
- Create tasks
- Update all task details
- Assign/unassign tasks
- Delete project

**Task Creators** can:
- Update task details
- Update task status
- Assign/unassign tasks
- Delete task

**Assigned Members** can:
- View assigned tasks
- Update only task status

### Task Visibility

Users can see tasks where they are:
- The project creator
- The task creator
- Assigned to the task

## 🐛 Troubleshooting

## 🐛 Troubleshooting

### Development Issues

#### Backend Won't Start
```bash
# Error: Port already in use
# Solution: Change PORT in .env or kill process on that port

# Error: Cannot connect to MongoDB
# Solution: 
# 1. Check MongoDB is running: mongosh or mongo shell
# 2. Verify DB_URL in .env
# 3. For Atlas: Check IP whitelist includes your IP

# Error: nodemon command not found
# Solution: npm install --save-dev nodemon
```

#### Frontend Won't Start
```bash
# Error: VITE_BACKEND_URL not working
# Solution: Environment variables must start with VITE_

# Error: Blank page or 404
# Solution:
# 1. Check npm run dev output for errors
# 2. Clear browser cache
# 3. Check console tab in DevTools
```

### Authentication Issues

#### 401 Unauthorized Errors
```
Issue: Getting 401 on all API requests after login
Solutions:
1. Check cookies in DevTools > Application > Cookies
   - Should have "token" cookie
   - Should have Secure, HttpOnly, SameSite=None flags
2. Verify JWT_SECRET is same in .env
3. Check CORS_ORIGIN matches frontend URL exactly
4. Clear cookies: DevTools > Application > Storage > Clear site data
5. Logout and login again
6. Check backend logs for token errors
```

#### Cookies Not Being Set
```
Issue: Login succeeds but no token cookie appears
Solutions:
1. Check backend sameSite setting (should be 'none' for production)
2. Verify frontend uses credentials: 'include' in fetch
3. Check domain/subdomain match for cross-origin
4. Ensure backend returns Set-Cookie header
5. Browser console may show security warnings - check them
```

#### Password Issues
```
Issue: Login fails with "Invalid credentials"
Solutions:
1. Verify password is correct (case-sensitive)
2. Ensure user exists: check MongoDB
3. Check bcrypt is installed: npm list bcrypt
4. Try resetting password by creating new account
```

### CORS & Cross-Origin Issues

#### CORS Error in Browser
```
Error: "Access to XMLHttpRequest blocked by CORS policy"
Solutions:
1. Verify CORS_ORIGIN in backend .env
2. Check it matches frontend URL exactly (no trailing slash)
3. For production: use https://domain.up.railway.app format
4. Restart backend after changing CORS_ORIGIN
```

#### Preflight Request Failing
```
Error: OPTIONS request returns 403/404
Solutions:
1. Ensure backend CORS middleware is before routes
2. Check optionsSuccessStatus: 200 is set
3. Verify allowedHeaders includes 'Content-Type'
4. Check methods array includes 'OPTIONS'
```

### Database Issues

#### Cannot Connect to MongoDB
```
Error: "connect ECONNREFUSED 127.0.0.1:27017"
Solutions (Local MongoDB):
1. Start MongoDB:
   - macOS: brew services start mongodb-community
   - Linux: sudo systemctl start mongod
   - Windows: mongod command or service start

2. Verify MongoDB is running:
   - mongosh or mongo (should connect)
   
3. Check bind_ip in /etc/mongod.conf (if not localhost)

Solutions (MongoDB Atlas):
1. Check connection string in DB_URL
2. Verify IP whitelist: Atlas > Network Access
3. Add your current IP or allow all (0.0.0.0/0)
4. Check username/password in connection string
5. Try copying fresh connection string from Atlas
```

#### Database Command Failed
```
Error: Database "admin" seeding failed
Solutions:
1. Check MongoDB is actually running
2. Verify DB credentials are correct
3. Ensure user has right permissions
4. Check MongoDB version compatibility
```

### Deployment Issues

#### Railway Deployment Fails
```
Error: "Build failed"
Solutions:
1. Check build logs in Railway dashboard
2. Verify start command exists in package.json
3. Check all dependencies are in package.json (not devDependencies)
4. Ensure TypeScript compiles: npm run build locally
5. Verify node_modules is in .gitignore
6. Try rebuilding: Railway > Service > Rebuild
```

#### Service Goes Down After Deploy
```
Error: Service crashes immediately
Solutions:
1. Check Railway logs for error messages
2. Verify all environment variables are set
3. Check PORT variable (Railway assigns automatically)
4. Ensure database connection string is correct
5. Try: Railway > Logs > scroll to find error
6. Check memory/CPU usage: may be insufficient
```

#### Frontend Shows Backend 404
```
Error: All API calls return 404
Solutions:
1. Verify VITE_BACKEND_URL is set correctly
2. Check backend service is running (Railway dashboard)
3. Try accessing backend URL directly in browser
4. Verify API routes match exactly (case-sensitive)
5. Check backend logs for routing errors
```

### Performance Issues

#### Slow Database Queries
```
Solutions:
1. Add database indexes for common queries
2. Monitor connection pool size
3. Check Atlas performance metrics
4. Consider pagination for large datasets
```

#### High Memory Usage
```
Solutions:
1. Check for memory leaks in logs
2. Reduce batch operation sizes
3. Add pagination to list endpoints
4. Monitor via Railway metrics
```

## 📚 Key Features in Detail

### Role-Based Permissions

**Project Creators** can:
- Add/remove members
- Create tasks
- Update all task details
- Assign/unassign tasks
- Delete project

**Task Creators** can:
- Update task details
- Update task status
- Assign/unassign tasks
- Delete task

**Assigned Members** can:
- View assigned tasks
- Update only task status

### Task Visibility

Users can see tasks where they are:
- The project creator
- The task creator
- Assigned to the task

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ HTTP-only cookies (prevents XSS)
- ✅ CORS protection
- ✅ Input validation with Zod
- ✅ Role-based access control
- ✅ Secure cookie settings (Secure, HttpOnly, SameSite)

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": { /* error details */ }
}
```

## 🚀 Building for Production

### Backend Build
```bash
cd backend

# Compile TypeScript to JavaScript
npm run build

# This creates a dist/ directory with compiled code
# Verify it works:
npm start
```

### Frontend Build
```bash
cd frontend

# Build for production
npm run build

# This creates a dist/ directory with optimized assets
# Preview the build:
npm run preview
```

### Docker Support (Optional)

If you want to use Docker for deployment:

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 📚 Additional Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)

### Tools & Services
- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [JWT Introduction](https://jwt.io/)
- [Zod Documentation](https://zod.dev/)

### Learning Resources
- Node.js & Express: [nodejs.org](https://nodejs.org/)
- React Patterns: [React Best Practices](https://react.dev/learn)
- Database Design: [MongoDB Tutorials](https://university.mongodb.com/)

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure:
- Code is formatted with prettier
- No lint errors: `npm run lint`
- TypeScript compiles without errors
- All environment variables are documented

## 📄 License

ISC

## 👤 Author

Parbhat Sharma

## 📞 Support

For issues and questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [API Endpoints](#api-endpoints) documentation
3. Check backend logs in Railway/Terminal
4. Check browser console for frontend errors
5. Review GitHub Issues

---

**Last Updated:** May 6, 2026
**Version:** 1.0.0
