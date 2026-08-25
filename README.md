# Gym Management App

A REST API for running a gym: members, memberships, trainers, and attendance tracking. Built with FastAPI and async SQLAlchemy.

## Tech Stack

- **FastAPI** — API framework
- **SQLAlchemy 2.0** (async) + **asyncpg** — ORM / PostgreSQL driver
- **PyJWT** — token-based authentication for admin-only routes

## Project Structure

```
backend/
├── main.py           # app entrypoint, router registration
├── database.py        # engine/session setup
├── model.py            # SQLAlchemy models
├── routes/            # FastAPI routers
├── controller/         # business logic
├── schemas/            # Pydantic request/response models
└── utils/helper.py     # JWT auth dependency
```

## Setup

1. Install dependencies
   ```
   pip install -r backend/requirements.txt
   ```
2. Configure environment — copy `backend/.env.example` to `backend/.env` and fill in your values:
   ```
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/gym_db
   SECRET_KEY=your-secret-key
   ```
3. Run the server
   ```
   uvicorn main:app --reload --app-dir backend
   ```
4. Open the interactive docs at `http://localhost:8000/docs`

Tables are created automatically on startup.

## API Overview

| Resource | Base Path | Auth |
|---|---|---|
| Admin | `/signup`, `/login`, `/is_auth` | — |
| Members | `/members` | Admin required for write ops |
| Memberships | `/plan` | Admin required for write ops |
| Trainers | `/trainers` | Admin required for write ops |
| Attendance | `/attendance` | Admin required for check-in/check-out |

Authenticate via `/login` to receive a JWT, then pass it as a Bearer token on protected routes.

### Attendance

- `POST /attendance/check-in` — log a member entering
- `POST /attendance/check-out` — log a member leaving
- `GET /attendance` — list, filterable by `member_id` and `date`
- `GET /attendance/today` — members currently checked in
