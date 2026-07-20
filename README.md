# PulseHR - Modern Human Resource Management System (HRMS)

PulseHR is a modern, full-stack Employee Management System (EMS / HRMS) built with **React**, **Node.js**, **Express**, and **MongoDB (Mongoose)**. It provides a unified single login portal for both Administrators and Employees, role-based dashboard routing, strict access control, automatic user account provisioning, and self-service password management.

---

## Key Features

- 🔐 **Unified Single Login Portal:** Single sign-in portal for both Administrators and Employees with JWT session handling.
- 👥 **Admin-Controlled Employee Management:** Only Administrators and HR Managers can create, update, or remove employees and departments. Standard employees have read-only directory access.
- ⚡ **Automatic User Account Provisioning:** When an Admin creates a new employee, a corresponding user account is automatically provisioned in MongoDB so the employee can immediately log in.
- 🔑 **Self-Service Password Management:** Provision for any logged-in user to update their password securely after initial login via their profile settings.
- 📊 **Role-Based Dashboard Routing:**
  - **Admin / HR Manager View:** Executive metrics covering total headcount, active duty vs. on leave status, total departments, annual payroll aggregations, department staffing ratios, and quick management controls.
  - **Employee View:** Personalized workspace portal with profile highlights, department info, and company directory highlights.
- 🛠️ **Robust Architecture & Centralized Error Handling:** Connects exclusively to MongoDB via Mongoose with centralized error handling for validation errors, cast errors, duplicate keys, and 404 routes.

---

## Tech Stack

- **Frontend:** React, React Router v6, Lucide Icons, Axios, Vanilla CSS (Design Tokens & Glassmorphism)
- **Backend:** Node.js, Express.js, Mongoose (MongoDB)
- **Authentication & Security:** JSON Web Tokens (JWT), Bcrypt.js password hashing
- **Tooling:** Vite, Concurrently

---

## Project Structure

```text
EMS-SYSTEM/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components & modals (Sidebar, Navbar, Modals)
│   │   ├── context/       # AuthContext for session & theme management
│   │   ├── pages/         # Login, Dashboard, EmployeeDirectory, EmployeeProfile, Departments, MyProfile
│   │   ├── App.jsx        # Route definitions & protection wrappers
│   │   └── main.jsx
│   └── package.json
├── server/                 # Express Backend API
│   ├── middleware/        # authMiddleware, adminMiddleware, errorHandler, notFound
│   ├── models/            # User, Department, Employee Mongoose schemas
│   ├── routes/            # auth, departments, employees, dashboard API routes
│   ├── utils/             # asyncHandler utility
│   ├── seed.js            # Initial database seeding script
│   ├── server.js          # Express app entrypoint
│   └── package.json
├── .gitignore             # Git ignore configuration
├── package.json           # Root package scripts for concurrent execution
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Running local instance or MongoDB Atlas URI)

### 1. Environment Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/pulsehr
JWT_SECRET=pulsehr_secret_key_2026_super_secure
NODE_ENV=development
```

> **Note:** Replace `MONGODB_URI` with your local MongoDB connection string or MongoDB Atlas cluster URI.

---

### 2. Installation

Install dependencies for the root project, server, and client concurrently:

```bash
npm run install:all
```

Or install dependencies manually:

```bash
# Root
npm install

# Backend Server
cd server && npm install

# Frontend Client
cd ../client && npm install
```

---

### 3. Running the Application

Run both the backend server and frontend development client simultaneously from the root directory:

```bash
npm run dev
```

Or run client and server in separate terminal windows:

```bash
# Terminal 1 - Backend Server (http://localhost:5001)
npm run server

# Terminal 2 - Frontend Client (http://localhost:5173)
npm run client
```

---

## Default Admin Credentials

Upon initial database startup, the application seeds a default Admin account:

- **Email:** `admin@pulsehr.com`
- **Password:** `password123`
- **Role:** `Admin`

---

## API Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates user & returns JWT token |
| `GET` | `/api/auth/me` | Authenticated | Fetches current user profile |
| `PUT` | `/api/auth/update-password` | Authenticated | Updates current user password |
| `GET` | `/api/employees` | Authenticated | Lists employees with search, filter & pagination |
| `POST` | `/api/employees` | Admin Only | Creates new employee & auto-provisions user account |
| `PUT` | `/api/employees/:id` | Admin Only | Updates employee details |
| `DELETE` | `/api/employees/:id` | Admin Only | Deletes employee record & user account |
| `GET` | `/api/departments` | Authenticated | Lists all departments with employee counts |
| `POST` | `/api/departments` | Admin Only | Creates a new department |
| `PUT` | `/api/departments/:id` | Admin Only | Updates department details |
| `DELETE` | `/api/departments/:id` | Admin Only | Deletes a department |
| `GET` | `/api/dashboard/stats` | Authenticated | Returns metrics & analytics data |
| `GET` | `/api/health` | Public | Server & Database connectivity health check |

---

## License

This project is licensed under the MIT License.
