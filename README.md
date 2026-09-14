# Support CRM

A full-stack customer support ticket management system with a **React** frontend, **FastAPI** backend, and **PostgreSQL** database.

---

## Features

- 📋 **Ticket Management** — Create, view, and update support tickets
- 🔍 **Search & Filter** — Real-time search and status filtering
- 📝 **Notes** — Add internal notes to any ticket
- 🔄 **Status Updates** — Change ticket status (Open / In Progress / Resolved / Closed)
- 📄 **Pagination** — Browse tickets page by page
- 🌑 **Matte Dark UI** — Clean, modern dark theme
- 🚀 **Render Ready** — Infrastructure-as-code Blueprint (`render.yaml`) included for automated deployment

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, Vanilla CSS         |
| Backend  | FastAPI, SQLAlchemy, Pydantic       |
| Database | PostgreSQL (via `DATABASE_URL`)     |
| Server   | Uvicorn                             |
| Hosting  | Render (Web Service + Static Site)  |

---

## Project Structure

```
support-crm/
├── render.yaml              # Render Blueprint configuration
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point & CORS
│   │   ├── database.py      # SQLAlchemy engine & session (Render postgres URL compatible)
│   │   ├── models/          # ORM models (Ticket, Note)
│   │   ├── routers/         # API route handlers (/api/tickets)
│   │   └── schemas/         # Pydantic validation schemas
│   ├── .env                 # Environment variables (git-ignored)
│   ├── .env.example         # Environment variable template
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main application component
    │   ├── App.css           # CSS barrel (imports all stylesheets)
    │   ├── config.js         # API base URL configuration (VITE_API_URL)
    │   └── styles/
    │       ├── variables.css # Design tokens (Matte Dark) & reset
    │       ├── layout.css    # App shell, topbar, dashboard
    │       ├── stats.css     # Stat card components
    │       ├── tickets.css   # Ticket list, toolbar, status badges
    │       ├── form.css      # New ticket form
    │       ├── detail.css    # Ticket detail view & notes
    │       ├── pagination.css
    │       └── responsive.css
    ├── .env.example         # Frontend env variable template
    └── package.json
```

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL database running locally or on the cloud

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL:
# DATABASE_URL=postgresql://user:password@localhost:5432/support_crm

# Start the API server
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.  
Interactive Swagger docs: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deployment on Render

You can deploy the entire stack on Render using **Option A (Blueprint)** or **Option B (Manual)**.

### Option A: Render Blueprint (Recommended — 1-Click)

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Connect your repository. Render will automatically detect [`render.yaml`](render.yaml) and configure:
   - **PostgreSQL Database** (`support-crm-db`)
   - **FastAPI Web Service** (`support-crm-api`)
   - **React Static Site** (`support-crm-frontend`)
5. Click **Apply**. Render will provision the database, build both services, and link the environment variables automatically.

---

### Option B: Manual Setup via Render Dashboard

If you prefer setting up the services individually:

#### 1. Create PostgreSQL Database
1. Go to **New +** → **PostgreSQL**.
2. Name: `support-crm-db`.
3. Plan: **Free**.
4. Once created, copy the **Internal Database URL** (or External Database URL if needed).

#### 2. Create Backend Web Service
1. Go to **New +** → **Web Service** → Connect your repository.
2. Configure:
   - **Name**: `support-crm-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
3. Under **Environment Variables**, add:
   - `DATABASE_URL`: *(paste the PostgreSQL connection string from step 1)*
   - `PYTHON_VERSION`: `3.11.9`
4. Click **Deploy Web Service**. Copy the service URL (e.g. `https://support-crm-api.onrender.com`).

#### 3. Create Frontend Static Site
1. Go to **New +** → **Static Site** → Connect your repository.
2. Configure:
   - **Name**: `support-crm-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://support-crm-api.onrender.com` *(your backend URL)*
4. Under **Redirects/Rewrites**, add a rewrite rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
5. Click **Deploy Static Site**.

---

## API Endpoints

| Method | Endpoint                              | Description            |
|--------|---------------------------------------|------------------------|
| GET    | `/`                                   | Root check             |
| GET    | `/health`                             | Health check & DB ping |
| GET    | `/api/tickets`                        | List tickets (`?search=` and `?status=`) |
| POST   | `/api/tickets/`                       | Create a new ticket    |
| GET    | `/api/tickets/{ticket_id}`            | Get ticket details     |
| PUT    | `/api/tickets/{ticket_id}`            | Update ticket status   |
| POST   | `/api/tickets/{ticket_id}/notes`      | Add a note to a ticket |

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/support_crm` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:5173` *(Render `.onrender.com` domains are allowed automatically)* |

### Frontend (`frontend/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://127.0.0.1:8000` (local) or `https://support-crm-api.onrender.com` |

---

## License

MIT
