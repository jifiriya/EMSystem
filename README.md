# PulseHR — Full-Stack Employee Management System (EMS)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)](https://www.mongodb.com/)

**PulseHR** is a modern, production-ready full-stack Human Resource & Employee Management System (EMS) built with Node.js, Express, MongoDB, and React (Vite). It features a sleek glassmorphic UI, dynamic light/dark theme switching, role-based security, real-time analytics, and optimized MongoDB aggregation pipelines.

---

## 🌟 Key Features

### 🔐 1. Authentication & Security (RBAC)
- **Single Unified Login Portal**: Supports `Admin`, `HR Manager`, and `Employee` roles via JWT authentication.
- **Role-Based Access Control**: Administrative features (creating/deleting departments, updating compensation, user provisioning) are strictly protected via server middleware.
- **Brute-Force Rate Limiting**: `/api/auth/login` and `/api/auth/update-password` are protected using `express-rate-limit`.
- **Automatic User Provisioning**: When an Admin creates a new employee, a corresponding user account is automatically provisioned for them.
- **Self-Service Password Updates**: Employees and Admins can update their login credentials anytime post-login.
- **ReDoS / Regex Injection Defense**: All dynamic query parameters are sanitized before regular expression evaluation.
- **Session Auto-Purge**: Global Axios interceptor automatically detects 401 Unauthorized responses and purges expired sessions.

### 📊 2. Executive HR Dashboard
- **Live Headcount Metrics**: Real-time counter for Total, Active, On-Leave, and Inactive personnel.
- **Department Staffing Distribution**: Calculates employee percentages per business unit using MongoDB Aggregation Pipelines.
- **Annual Payroll Commitment**: Dynamically calculates total annual salary commitment (`$sum: '$salary'`).
- **Recent Onboardings Feed**: Highlights the 5 newest hires with direct profile navigation links.
- **Role-Tailored Views**: Displays an Executive Overview for Admins and a Workspace View for standard Employees.

### 👥 3. Employee Directory & Profile Management
- **Dual Display Modes**: Toggle seamlessly between a **Grid Cards View** and a **Tabular List View**.
- **Debounced Real-Time Search**: 300ms debounced search bar querying names, emails, roles, and employee IDs without network spam.
- **Multi-Filter Capabilities**: Filter by Department and Employment Status (`Active`, `On Leave`, `Inactive`).
- **Full CRUD Management**: Add, update, view, or remove employee records with rich modal dialogs.
- **Comprehensive Profile View**:
  - Detailed contact information & office locations.
  - Organization & role assignments.
  - Annual compensation tracking (Admin-only).
  - Emergency contact details and professional summary notes.
  - Dynamic avatar fallback using `ui-avatars`.

### 🏢 4. Department Management
- **Organizational Structure**: Create, edit, and view departments with unique codes, assigned managers, locations, and annual budgets.
- **Live Employee Count Aggregation**: Shows live member count per department.
- **Referential Integrity Guards**: Prevents deletion of any department that currently has active assigned employees.

### 🎨 5. Premium UI/UX & Design System
- **Dynamic Light & Dark Theme**: Built-in theme switcher with CSS variable tokens and instant `localStorage` persistence.
- **Glassmorphic Styling**: Translucent sticky header navigation with backdrop blur filters.
- **Responsive Navigation**: Mobile-optimized slide-over navigation drawer.
- **Custom CSS Design Tokens**: Zero Tailwind bloat; clean, maintainable Vanilla CSS tokens.

---

## 🛠️ Tech Stack

### Backend (`EMS_Backend`)
- **Runtime**: Node.js
- **Framework**: Express 4.x
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`)
- **Security & Utilities**: `express-rate-limit`, `cors`, `dotenv`, custom `asyncHandler` & `regex` escaping

### Frontend (`EMS_Fronend`)
- **Framework**: React 18 + Vite 5
- **Routing**: React Router DOM `v6`
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS (Custom Design System & Theme Engine)

---

## 📁 Repository Structure

```
EMS/
├── EMS_Backend/                  # Express REST API Server
│   ├── middleware/               # auth, errorHandler, notFound
│   ├── models/                   # User, Department, Employee
│   ├── routes/                   # auth, dashboard, departments, employees
│   ├── utils/                    # asyncHandler, regex
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env                      # Environment configuration
│
├── EMS_Fronend/                  # React (Vite) SPA
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, EmployeeModal, DepartmentModal
│   │   ├── context/              # AuthContext (Auth state & theme engine)
│   │   ├── pages/                # Dashboard, Directory, Profile, Departments, Login
│   │   ├── App.jsx & main.jsx
│   │   └── index.css             # CSS design tokens & dark mode definitions
│   ├── vite.config.js            # Vite config with API proxy
│   ├── package.json
│   └── vercel.json
│
├── vercel.json                   # Root deployment configuration
└── README.md                     # Project documentation
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `EMS_Backend` folder:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ems_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **MongoDB**: Active Cloud MongoDB Atlas instance or local MongoDB instance.

---

### Step 1: Start the Backend Server

```bash
# Navigate to backend directory
cd EMS_Backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The Express API will start running on **`http://localhost:5001`**.

---

### Step 2: Start the Frontend Application

Open a new terminal window:

```bash
# Navigate to frontend directory
cd EMS_Fronend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The React frontend will be accessible at **`http://localhost:5173`**.

---

## 🧪 Production Build & Deployment

### Build Frontend for Production

```bash
cd EMS_Fronend
npm run build
```

This compiles optimized static assets into `EMS_Fronend/dist/`.

---
