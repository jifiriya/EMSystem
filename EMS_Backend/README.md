# EMS Backend (Employee Management System API)

RESTful API backend for the Employee Management System built with **Express.js**, **MongoDB / Mongoose**, **JSON Web Tokens (JWT)**, and **BcryptJS**.

## Features

- **Authentication & Authorization**: Secure login, role-based access control (Admin / Employee), JWT verification.
- **Employee Management API**: CRUD endpoints for employee profiles, personal details, job titles, and departments.
- **Attendance & Leave API**: Endpoints for logging attendance, submitting leave requests, and administrative approval workflows.
- **Payroll Management API**: Endpoints for managing salary components and generating pay statements.
- **Database Support**: MongoDB via Mongoose ODM (with support for `mongodb-memory-server` in standalone mode).

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS (`cors`)
- **Environment**: Dotenv

## Environment Variables

Create a `.env` file in the `EMS_Backend` folder with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ems_db
JWT_SECRET=your_jwt_secret_key_here
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance running (or local URI)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd EMS_Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Seed initial data:
   ```bash
   node seed.js
   ```

### Running the Server

Start the development server:

```bash
npm run dev
```

Or start with standard Node:

```bash
npm start
```

The API server will run on `http://localhost:5000`.
