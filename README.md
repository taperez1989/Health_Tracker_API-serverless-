# Health Tracker App (Monorepo)

The **Health Tracker App** is a fullstack project that allows users to log **meals** and **workouts** through a serverless backend and view/interact with the data using a modern **React (Vite) + TailwindCSS** frontend.

This repository follows a monorepo structure, containing both backend and frontend codebases.

---

## Tech Stack Overview

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) + TailwindCSS + Axios |
| Backend | AWS Lambda + API Gateway |
| Database | DynamoDB (Single-Table Design) |
| Auth (future) | AWS Cognito |
| Deployment | AWS Console / IaC (CDK or Terraform, TBD) |

---

## Project Structure

/health-tracker/
├── frontend/ # React client + TailwindCSS
├── backend/ # Serverless REST API (Lambda + DynamoDB)
└── README.md # (you are here)


Each folder contains its own README with setup instructions, architecture, and deployment details.

-  **Backend Docs:** [`/backend/README.md`](backend/README.md)
-  **Frontend Docs:** [`/frontend/README.md`](frontend/README.md)

---

## 🗺 Roadmap

| Phase | Description |
|-------|-------------|
| **Phase 0** | Backend MVP (POST meal + POST workout) |
| **Phase 1** | React UI + Fetch/Axios integration |
| **Phase 2** | TanStack Query + data caching |
| **Phase 3** | Authentication (Cognito) |
| **Phase 4** | GET endpoints + dashboard views |
| **Phase 5** | Charts, analytics & progress history |

---

## Contribution Guide

See **`CONTRIBUTING.md`** (coming soon) for branching, PR process, and coding standards.

---

## License

TBD for now (internal educational project).



# Backend — Health Tracker API (Serverless)

> **Purpose:** Expose REST endpoints to log meals and workouts, storing them in DynamoDB using a single-table design.

---

## MVP Requirements

- `POST /meal` → Log a meal
- `POST /workout` → Log a workout
- Store records in `HealthTracker` DynamoDB table
- Use AWS Lambda + API Gateway
- Return standardized JSON responses

 Out of Scope (for now):
Authentication, querying, updating, deleting entries, macros, analytics UI.

---

## 🏗 Architecture
Client
→ API Gateway (REST)
→ Lambda (Node.js)
→ DynamoDB (HealthTracker)

Deployment Notes

Deploy via AWS Console or IaC (CDK/Terraform – TBD).

Use environment variables for table names and region.

IAM policy must restrict access to this single table only.

🛠 Future Backend Phases
Feature	Description
Auth	Cognito + user partition keys
GET queries	Meals/workouts by date, filtering
Analytics	Calories + fitness progress
Macros	Protein, carbs, fat support


---

# **`frontend/README.md`**

```markdown
# 🖥 Frontend — Health Tracker Client (React + Tailwind)

> **Purpose:** Provide a user interface to log meals and workouts using the backend API.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vite + React | UI framework |
| TailwindCSS | Styling |
| Axios | API requests (Phase 1) |
| TanStack Query | Query layer (Phase 2) |

---

## MVP Scope

- Create UI forms to log:
  - Meals (name + calories)
  - Workouts (name + duration)
- Send POST requests to backend endpoints using Axios
- Basic visual confirmation on success (no list view yet)

---

## Folder Structure

frontend/
├── src/
│ ├── components/
│ │ ├── MealForm.jsx
│ │ ├── WorkoutForm.jsx
│ │ └── Notification.jsx (Phase 2)
│ ├── api/
│ │ └── axios.js
│ ├── App.jsx
│ └── main.jsx
└── package.json

Future UI Phases
Phase	Feature
2	Add TanStack Query + caching + loading states
3	Add authentication UI
4	Add list pages & charts
