# Gym Management App

![FastAPI](https://img.shields.io/badge/FastAPI-0.136.3-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Async-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-CB2929?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)

A backend management system built with **FastAPI** for handling the core operations of a gym.

The project provides a modular foundation for managing members, trainers, memberships, attendance, and other gym operations. It is designed so developers can extend the existing architecture and turn it into their own gym management product, admin dashboard, or full-stack fitness platform.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| **FastAPI** | REST API framework |
| **Python 3.11+** | Backend development |
| **PostgreSQL** | Relational database |
| **SQLAlchemy 2.0** | Async ORM and database operations |
| **asyncpg** | Asynchronous PostgreSQL driver |
| **Pydantic** | Request and response validation |
| **JWT / PyJWT** | Admin authentication |
| **OAuth2 Bearer** | Protected route authentication |
| **Uvicorn** | ASGI application server |
| **python-dotenv** | Environment configuration |

The application follows an asynchronous database workflow using FastAPI and SQLAlchemy's `AsyncSession`.

---

# Key Modules

### Admin Authentication
Handles administrator accounts and access to protected functionality.

### Members
Manages gym member information and account status.

### Trainers
Stores and manages trainer information and availability status.

### Membership Plans
Defines the membership packages offered by the gym, including duration and pricing.

### Memberships
Connects members with membership plans and trainers while managing subscription lifecycle and renewals.

### Attendance
Tracks member check-ins and check-outs and prevents invalid attendance sessions.

### Gym Classes
Provides the model foundation for adding scheduled gym classes and trainer-led sessions.

---

# Project Architecture

The backend separates responsibilities into **models, schemas, routes, and controllers**.

```text
backend/
│
├── main.py
├── database.py
├── model.py
│
├── controller/
│   ├── admin.py
│   ├── attendance.py
│   ├── member.py
│   ├── membership.py
│   ├── membership_plan.py
│   └── trainer.py
│
├── routes/
│   ├── AdminRoute.py
│   ├── AttendanceRoute.py
│   ├── MemberRoute.py
│   ├── MembershipPlanRoute.py
│   ├── MembershipRoute.py
│   └── TrainerRoute.py
│
├── schemas/
│
├── utils/
│   └── helper.py
│
├── requirements.txt
└── .env.example
```

The general application flow is:

```text
Client
   │
   ▼
FastAPI Route
   │
   ▼
Controller
   │
   ▼
SQLAlchemy Model
   │
   ▼
PostgreSQL
```

**Routes** define the available API endpoints.

**Controllers** contain the business logic behind those endpoints.

**Schemas** define and validate incoming and outgoing data.

**Models** represent the database tables and relationships.

This separation makes it easier to add new functionality without putting all application logic inside route files.

---

# Build Your Own Gym Product

This repository can be used as a starting point rather than only as a finished application.

You can clone the project and introduce your own modules while following the existing architecture.

For example, suppose your gym requires a **Workout Program** module.

### Step 1 — Create the Database Model

Add the model to `model.py`:

```python
class WorkoutProgram(Base):
    __tablename__ = "workout_programs"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str]
    duration_weeks: Mapped[int]
```

This defines how workout programs will be stored in PostgreSQL.

### Step 2 — Create the Schema

Create the corresponding Pydantic schemas inside `schemas/`.

```python
class WorkoutProgramCreate(BaseModel):
    name: str
    description: str
    duration_weeks: int
```

Schemas determine what data your API accepts and validates.

### Step 3 — Create the Controller

Add:

```text
controller/workout_program.py
```

The controller should contain the business logic required to create, retrieve, update, or delete workout programs.

For example:

```python
async def create_workout_program(data, db):
    program = WorkoutProgram(**data.model_dump())

    db.add(program)
    await db.commit()
    await db.refresh(program)

    return program
```

### Step 4 — Create the Route

Add:

```text
routes/WorkoutProgramRoute.py
```

Define the API endpoints and connect them to the controller.

```python
router = APIRouter(prefix="/workout-programs")

@router.post("/")
async def create_program(
    data: WorkoutProgramCreate,
    db: AsyncSession = Depends(get_db)
):
    return await create_workout_program(data, db)
```

### Step 5 — Register the Router

Import the new router inside `main.py`:

```python
from routes.WorkoutProgramRoute import router as workout_router

app.include_router(workout_router)
```

Your new module now becomes part of the application.

The same pattern can be followed for features such as:

- Payments and invoices
- Personal training packages
- Workout programs
- Exercise libraries
- Nutrition plans
- Class scheduling
- Class bookings
- Equipment management
- Staff management
- Member progress tracking
- Notifications

---

# Turning the Backend Into a Full Product

The API can serve as the backend for different types of applications.

```text
                    Gym Management Backend
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼
       Admin Dashboard   Public Website   Member Portal
             │               │               │
             ▼               ▼               ▼
      Manage Gym Data    View Services    Membership
      Members/Plans      View Trainers    Attendance
      Attendance         View Classes     Class Booking
      Trainers           Memberships      Profile
```

For example, a **Next.js** frontend can consume the FastAPI endpoints to create an admin dashboard and public gym website.

The backend can therefore act as the central management system while multiple frontend applications consume the same API.

---

# Getting Started

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd "Gym managment App"
```

## 2. Create a Virtual Environment

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

## 3. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

## 4. Configure Environment Variables

Create:

```text
backend/.env
```

Using `.env.example` as the template:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/gym_db
SECRET_KEY=your-secret-key
```

## 5. Run the Backend

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

The API will be available locally on port `8000`.

FastAPI also provides interactive API documentation through:

```text
/docs
```

and:

```text
/redoc
```

---

# Extending the Project

When adding a new feature, follow the same development flow:

```text
Database Model
      ↓
Pydantic Schema
      ↓
Controller / Business Logic
      ↓
FastAPI Route
      ↓
Register Router
      ↓
Test through Swagger
      ↓
Connect Frontend
```

Keeping new functionality within this structure helps the application remain modular as it grows.

---

# Production Improvements

For a production deployment, consider adding:

- Alembic database migrations
- Automated API tests
- Role-based access control
- Refresh tokens
- Rate limiting
- Logging and monitoring
- Payment integration
- Email notifications
- Docker support
- CI/CD pipelines

---

## License

This project is currently unlicensed. Add a license if you intend to allow public reuse or contributions.
