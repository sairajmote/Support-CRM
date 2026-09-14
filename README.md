# Support CRM

A full-stack customer support ticket management system with a **React** frontend and a **FastAPI** backend.

---

## Features

- 📋 **Ticket Management** — Create, view, and update support tickets
- 🔍 **Search & Filter** — Real-time search and status filtering
- 📝 **Notes** — Add internal notes to any ticket
- 🔄 **Status Updates** — Change ticket status (Open / In Progress / Resolved / Closed)
- 📄 **Pagination** — Browse tickets page by page
- 🌑 **Matte Dark UI** — Clean, modern dark theme

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, Vanilla CSS         |
| Backend  | FastAPI, SQLAlchemy, Pydantic       |
| Database | PostgreSQL (via `DATABASE_URL`)     |
| Server   | Uvicorn                             |

---

## Project Structure

```
support-crm/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── database.py      # SQLAlchemy engine & session
│   │   ├── models/          # ORM models
│   │   ├── routers/         # API route handlers
│   │   └── schemas/         # Pydantic schemas
│   ├── .env                 # Environment variables (git-ignored)
│   ├── .env.example         # Environment variable template
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main application component
    │   ├── App.css           # CSS barrel (imports all stylesheets)
    │   └── styles/
    │       ├── variables.css # Design tokens & reset
    │       ├── layout.css    # App shell, topbar, dashboard
    │       ├── stats.css     # Stat card components
    │       ├── tickets.css   # Ticket list, toolbar, status badges
    │       ├── form.css      # New ticket form
    │       ├── detail.css    # Ticket detail view & notes
    │       ├── pagination.css
    │       └── responsive.css
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL database

---

### Backend Setup

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
Interactive docs: `http://127.0.0.1:8000/docs`

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint                              | Description            |
|--------|---------------------------------------|------------------------|
| GET    | `/api/tickets`                        | List all tickets (supports `?search=` and `?status=`) |
| POST   | `/api/tickets/`                       | Create a new ticket    |
| GET    | `/api/tickets/{ticket_id}`            | Get ticket details     |
| PUT    | `/api/tickets/{ticket_id}`            | Update ticket status   |
| POST   | `/api/tickets/{ticket_id}/notes`      | Add a note to a ticket |
| GET    | `/health`                             | Health check           |

---

## Environment Variables

Create a `.env` file inside the `backend/` directory based on `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/support_crm
```

---

## License

MIT
