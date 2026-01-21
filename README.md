# Trophy

Trophy is a comprehensive project management and tracking application designed to streamline team collaboration and project oversight. It provides a robust platform for managing projects, tracking progress, and ensuring team alignment through real-time alerts and notifications.

## Problem Statement
In fast-paced development environments, keeping track of project progress, ensuring effective team communication, and managing tasks efficiently can be challenging. Trophy addresses these issues by providing a centralized dashboard for project management, real-time updates, and administrative controls to maintain workflow efficiency.

## Tech Stack

### Backend
- **Language:** Python
- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** OAuth2 with Password (Bearer token)

### Frontend
- **Framework:** React Native (Expo)
- **HTTP Client:** Axios
- **State Management:** React Hooks

## Features
- **User Authentication:** Secure signup and login functionality.
- **Project Management:** Create, view, and manage projects.
- **Dashboard:** Visual overview of project statistics and user activities.
- **Real-time Alerts:** Notification system for important updates.
- **Admin Panel:** Administrative controls for user and project management.

## How to Run Locally

### Prerequisites
- Python 3.8+
- Node.js & npm
- PostgreSQL

### Backend Setup
1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure Environment Variables:**
   Create a `.env` file in the `backend` directory with the following content:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/dbname
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ADMIN_SECRET_KEY=trophy_admin_2026
   ```
5. **Run the server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```


### Frontend Setup
1. **Navigate to the frontend directory:**
   ```bash
   cd trophy-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the application:**
   ```bash
   npx expo start
   ```
   Scan the QR code with the Expo Go app on your mobile device or run on an emulator.

## API Documentation
The backend provides interactive API documentation via Swagger UI.

- **Docs URL:** `http://127.0.0.1:8000/docs`
- **Redoc URL:** `http://127.0.0.1:8000/redoc`

### Key Endpoints
- `POST /auth/token`: Login and get access token.
- `POST /users/`: Register a new user.
- `GET /projects/`: List all projects.
- `POST /projects/`: Create a new project.
- `GET /dashboard/stats`: Get dashboard statistics.
