<p align="center">
  <img src="frontend/src/assets/giki-logo.png" alt="GIK Institute" width="80" />
</p>

<h1 align="center">OptiSpace</h1>
<p align="center">
  <strong>Smart Campus Facility Booking System</strong><br/>
  GIK Institute of Engineering Sciences & Technology
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Course-CS232%20DBMS-blue" alt="Course" />
  <img src="https://img.shields.io/badge/Semester-Spring%202026-green" alt="Semester" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black" alt="React" />
</p>

---

## Overview

OptiSpace is a full-stack web application for managing facility bookings across the GIK Institute campus. It enables students, faculty, and society heads to discover available facilities, submit booking requests, and receive approvals — while giving administrators a centralized dashboard to manage users, facilities, and booking workflows.

### Key Features

- **Role-Based Access Control** — 4 roles: Admin, Faculty, Student, Society Head
- **Real-Time Conflict Detection** — prevents double-booking with overlapping time checks
- **Transactional Approval System** — ACID-compliant approve/reject with BEGIN/COMMIT/ROLLBACK
- **Smart Recommendations** — least-used facilities, best time slots, similar alternatives
- **Usage Analytics** — department-wise usage tracking with automated analytics via triggers
- **Campus-Specific** — facilities mapped to real GIK departments (FCSE, FME, FMCE, BB, FBS, NAB)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Database** | PostgreSQL 16 |
| **Backend** | Node.js, Express.js, pg (node-postgres) |
| **Authentication** | JWT (jsonwebtoken), bcrypt |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **API Client** | Axios |

---

## Database Design

### Entity Relationship Diagram

<p align="center">
  <img src="docs/Optispace Entity Relation Diagram.png" alt="OptiSpace ERD" width="700" />
</p>

### Schema (9 Tables)

### Tables

| Table | Purpose |
|-------|---------|
| `departments` | Academic departments (FCSE, FME, FMCE, BB, FBS, NAB) |
| `roles` | User roles with permissions |
| `users` | All system users with role and department FK |
| `facilities` | Campus facilities (Labs, Classrooms, Auditorium, Sports) |
| `equipment` | Equipment inventory linked to facilities |
| `booking_requests` | All booking submissions with status tracking |
| `approved_bookings` | Confirmed bookings (populated on approval) |
| `approval_records` | Admin decision audit trail with remarks |
| `usage_analytics` | Auto-generated usage data (trigger-based) |

### Views

- `view_facility_utilization` — utilization percentage per facility
- `view_user_booking_summary` — booking counts per user
- `view_department_usage` — department-wise usage aggregation
- `view_peak_hours` — identifies busiest hours per facility

### Key Constraints

- `chk_valid_time` — ensures `end_time > start_time` on bookings
- Overlapping time detection via SQL range comparisons
- CASCADE foreign keys with application-level deletion guards
- 3NF normalized — no redundant data storage

---

## Project Structure

```
optispace/
├── database/
│   ├── schema.sql          # DDL: tables, views, indexes, triggers
│   ├── seed.sql            # GIK-specific seed data
│   └── queries.sql         # 28+ documented SQL queries for viva
│
├── backend/
│   ├── server.js           # Express app entry point
│   ├── config/
│   │   └── db.js           # PostgreSQL connection pool
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   └── roles.js        # Role-based authorization
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── facilityController.js
│   │   ├── bookingController.js
│   │   ├── recommendationController.js
│   │   └── analyticsController.js
│   ├── queries/
│   │   ├── authQueries.js
│   │   ├── userQueries.js
│   │   ├── facilityQueries.js
│   │   ├── bookingQueries.js
│   │   ├── recommendationQueries.js
│   │   └── analyticsQueries.js
│   └── routes/
│       ├── auth.js
│       ├── users.js
│       ├── facilities.js
│       ├── bookings.js
│       ├── recommendations.js
│       └── analytics.js
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useAuth.js
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── BookingCard.jsx
│   │   │   └── FacilityCard.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Facilities.jsx
│   │       ├── FacilityDetail.jsx
│   │       ├── BookingForm.jsx
│   │       ├── MyBookings.jsx
│   │       ├── admin/
│   │       │   ├── ManageUsers.jsx
│   │       │   ├── ManageFacilities.jsx
│   │       │   ├── ApprovalQueue.jsx
│   │       │   ├── BookingHistory.jsx
│   │       │   └── Analytics.jsx
│   │       └── recommendations/
│   │           └── Recommendations.jsx
│   └── ...
│
└── docs/
    ├── Optispace Entity Relation Diagram.png
    ├── Optispace Entity Relation Diagram.drawio
    ├── Optispace_3NF_Report.docx
    ├── Relational_Schema.png
    ├── Relational_Schema_XML.drawio
    └── normalization.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Admin |
| POST | `/api/users` | Admin |
| PUT | `/api/users/:id` | Admin |
| DELETE | `/api/users/:id` | Admin |
| PUT | `/api/users/:id/activate` | Admin |

### Facilities
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/facilities` | Authenticated |
| GET | `/api/facilities/:id` | Authenticated |
| GET | `/api/facilities/available` | Authenticated |
| POST | `/api/facilities` | Admin |
| PUT | `/api/facilities/:id` | Admin |
| DELETE | `/api/facilities/:id` | Admin |

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/bookings/mine` | Authenticated |
| GET | `/api/bookings/pending` | Admin |
| GET | `/api/bookings/active` | Authenticated |
| GET | `/api/bookings/history` | Admin |
| POST | `/api/bookings` | Authenticated |
| PUT | `/api/bookings/:id/approve` | Admin |
| PUT | `/api/bookings/:id/reject` | Admin |
| PUT | `/api/bookings/:id/cancel` | Authenticated |

### Recommendations
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/recommendations/least-used` | Authenticated |
| GET | `/api/recommendations/by-department` | Authenticated |
| GET | `/api/recommendations/best-slots/:id` | Authenticated |
| GET | `/api/recommendations/similar/:id` | Authenticated |
| GET | `/api/recommendations/next-slot/:id` | Authenticated |

### Analytics
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/analytics/overview` | Admin |

---

## Transactions (ACID Compliance)

### T1: Approve Booking
```sql
BEGIN;
  -- Re-check for time conflicts (prevents race conditions)
  -- Update booking_requests status → 'Approved'
  -- Insert into approved_bookings
  -- Insert approval record with admin remarks
COMMIT;
```

### T2: Reject Booking
```sql
BEGIN;
  -- Update booking_requests status → 'Rejected'
  -- Insert approval record with rejection remarks
COMMIT;
```

Both transactions use `ROLLBACK` on any failure, ensuring atomicity.

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL 16
- npm

### 1. Database Setup
```bash
# Create database in pgAdmin or psql
CREATE DATABASE optispace;

# Run schema (creates tables, views, indexes, trigger)
\i database/schema.sql

# Run seed data
\i database/seed.sql
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your DB credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=Optispace
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=optispace_secret_key_2026
# PORT=5000

npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Default Admin: `admin@giki.edu.pk` / `GIK@12345`

---

## Team

| Member | Role | Responsibilities |
|--------|------|-----------------|
| **Reyan Kashif** (2024538) | Backend & Database Developer | API development, database design, server architecture |
| **Sohaib Bin Tausif** (2024595) | Frontend & Database Developer | User-facing pages, shared components, UI/UX, database queries |
| **Ghazali Khan** (2024380) | Frontend & Database Developer | Admin pages, auth context, state management, database queries |

---

## Course Information

| | |
|---|---|
| **Course** | CS232 — Database Management Systems |
| **Semester** | Spring 2026 |
| **Institute** | GIK Institute of Engineering Sciences & Technology |
| **Department** | Department of Cyber Security |

---

## License

This project is developed as an academic assignment for CS232 at GIK Institute. Not intended for production use.
