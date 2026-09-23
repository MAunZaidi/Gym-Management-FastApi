# Gym Management App

![FastAPI](https://img.shields.io/badge/FastAPI-0.136.3-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Async-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-CB2929?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)

A clean FastAPI backend for managing gym operations: admins, members, trainers, membership plans, active subscriptions, and attendance check-ins.

The project is built around an async PostgreSQL workflow using SQLAlchemy 2.0, Pydantic schemas, JWT admin authentication, and organized route/controller layers.

## Highlights

- Admin signup, login, logout, and JWT-based route protection
- Member CRUD with unique email validation
- Trainer CRUD with active/inactive status support
- Membership plan CRUD with duration, pricing, and plan status
- Membership creation, filtering, renewal, cancellation, and expiring-soon lookup
- Attendance check-in/check-out flow with active session validation
- Auto-created database tables on application startup
- Interactive API documentation through FastAPI Swagger UI

## Tech Stack

| Layer | Tools |
| --- | --- |
| API | FastAPI, Uvicorn |
| Database | PostgreSQL, asyncpg |
| ORM | SQLAlchemy 2.0 async |
| Validation | Pydantic |
| Auth | PyJWT, OAuth2 bearer tokens |
| Config | python-dotenv |

## Project Structure

```text
backend/
|-- main.py                     # FastAPI app, lifespan hook, router registration
|-- database.py                 # Async engine, session factory, database dependency
|-- model.py                    # SQLAlchemy models and enums
|-- requirements.txt            # Python dependencies
|-- .env.example                # Environment variable template
|-- controller/                 # Business logic for each resource
|   |-- admin.py
|   |-- attendance.py
|   |-- member.py
|   |-- membership.py
|   |-- membership_plan.py
|   `-- trainer.py
|-- routes/                     # FastAPI routers
|   |-- AdminRoute.py
|   |-- AttendanceRoute.py
|   |-- MemberRoute.py
|   |-- MembershipPlanRoute.py
|   |-- MembershipRoute.py
|   `-- TrainerRoute.py
|-- schemas/                    # Pydantic request/response models
`-- utils/
    `-- helper.py               # JWT auth dependency
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd "Gym managment App"
```

### 2. Create a Virtual Environment

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

> Note: the current auth controller imports `pwdlib` for password hashing. If it is not already installed in your environment, install it with:
>
> ```bash
> pip install pwdlib
> ```

### 4. Configure Environment Variables

Copy the example file:

```bash
copy backend\.env.example backend\.env
```

For macOS/Linux:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/gym_db
SECRET_KEY=your-secret-key
```

### 5. Start the API

```bash
uvicorn main:app --reload --app-dir backend
```

Then open:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Authentication Flow

Protected routes use a bearer token generated from admin login.

1. Create an admin with `POST /signup`.
2. Log in with `POST /login`.
3. Copy the `access_token` from the response.
4. Click **Authorize** in Swagger UI and enter:

```text
Bearer <access_token>
```

Tokens are currently configured to expire after 30 minutes.

## API Overview

| Resource | Method | Endpoint | Auth |
| --- | --- | --- | --- |
| Admin | POST | `/signup` | Public |
| Admin | POST | `/login` | Public |
| Admin | GET | `/is_auth` | Admin |
| Admin | POST | `/logout` | Admin |
| Members | GET | `/members` | Public |
| Members | GET | `/members/{memberid}` | Public |
| Members | POST | `/members` | Admin |
| Members | PUT | `/members/{memberid}` | Admin |
| Members | DELETE | `/members/{memberid}` | Admin |
| Members | GET | `/members/{member_id}/attendance` | Public |
| Membership Plans | GET | `/plan` | Public |
| Membership Plans | GET | `/plan/{ms_id}` | Public |
| Membership Plans | POST | `/plan` | Admin |
| Membership Plans | PUT | `/plan/{ms_id}` | Admin |
| Membership Plans | DELETE | `/plan/{ms_id}` | Admin |
| Trainers | GET | `/trainers` | Public |
| Trainers | GET | `/trainers/{trainerid}` | Public |
| Trainers | POST | `/trainers` | Admin |
| Trainers | PUT | `/trainers/{trainerid}` | Admin |
| Trainers | DELETE | `/trainers/{trainerid}` | Admin |
| Memberships | GET | `/memberships` | Public |
| Memberships | GET | `/memberships/{membership_id}` | Public |
| Memberships | GET | `/memberships/expiring-soon?days=7` | Public |
| Memberships | POST | `/memberships` | Admin |
| Memberships | PUT | `/memberships/{membership_id}` | Admin |
| Memberships | POST | `/memberships/{membership_id}/renew` | Admin |
| Memberships | DELETE | `/memberships/{membership_id}` | Admin |
| Attendance | GET | `/attendance` | Public |
| Attendance | GET | `/attendance/today` | Public |
| Attendance | POST | `/attendance/check-in` | Admin |
| Attendance | POST | `/attendance/check-out` | Admin |

## Example Requests

### Create an Admin

```http
POST /signup
{
  "name": "Admin User",
  "email": "admin@gym.com",
  "password": "strong-password"
}
```

### Create a Member

```http
POST /members
{
  "name": "Alex Carter",
  "email": "alex@example.com",
  "phone": "555-0101",
  "gender": "Male",
  "dob": "1998-04-18",
  "address": "21 Fitness Street",
  "is_active": true
}
```

### Create a Membership Plan

```http
POST /plan
{
  "name": "Monthly",
  "duration": "30",
  "price": 49.99,
  "decription": "Access to gym facilities for 30 days",
  "is_active": true
}
```

### Assign a Membership

```http
POST /memberships
{
  "member_id": 1,
  "plan_id": 1,
  "trainer_id": null,
  "start_date": "2026-09-23"
}
```

### Check In a Member

```http
POST /attendance/check-in
{
  "member_id": 1
}
```

## Current State

This repository currently contains the backend API only. The core gym workflows are implemented and split into routes, controllers, schemas, and SQLAlchemy models.

Implemented:

- Admin authentication
- Members
- Trainers
- Membership plans
- Membership subscriptions
- Attendance tracking

Present in the model layer but not yet exposed through routes:

- Gym class scheduling

Recommended next improvements:

- Add `pwdlib` to `backend/requirements.txt`
- Add tests for auth, membership renewal, attendance check-in/check-out, and validation errors
- Add database migrations with Alembic for production-safe schema changes
- Add a frontend dashboard for admins
- Standardize a few field names before a public API release, such as `decription` to `description`

## Database Notes

Tables are created automatically during FastAPI startup through:

```python
await conn.run_sync(Base.metadata.create_all)
```

This is convenient for local development. For production, use a migration tool such as Alembic.

## License

This project is currently not licensed. Add a license before publishing it for public reuse.
