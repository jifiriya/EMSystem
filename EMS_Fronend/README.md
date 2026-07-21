# EMS Frontend (Employee Management System)

Single Page Application (SPA) for the Employee Management System built with **React**, **Vite**, **React Router**, and **Lucide React**.

## Features

- **Dashboard & Analytics**: Overview of employee stats, department breakdowns, and quick action cards.
- **Employee Directory & Details**: Full CRUD operations for managing employees, search, and filtering.
- **Attendance & Leave Management**: Track attendance logs and request/approve leave applications.
- **Payroll & Salary Slips**: View salary details, pay structures, and download/print payslips.
- **Responsive UI**: Glassmorphic dashboard UI built with modern CSS aesthetics.

## Tech Stack

- **Framework**: React (Vite)
- **Routing**: React Router DOM (`v6`)
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- NPM

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd EMS_Fronend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### Building for Production

To generate the static production build:

```bash
npm run build
```

The output will be created in the `dist/` directory, ready to deploy to Vercel, Netlify, or static hosting.
