# Smart Timetable Generator & Student Productivity System

A student productivity application with a Python desktop client and a separate React/Vite web frontend. The desktop app manages timetables, subjects, attendance, assignments, exams, study sessions, reports, and student profiles using SQLite.

## Python desktop application

Requires Python 3.10 or newer. From the repository root:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
python -m pip install -r requirements.txt
python -m SmartTimetable
```

`python main.py` is also available as a compatibility launcher. Python modules live in `SmartTimetable/` and use package-relative imports. The app creates its local SQLite database and output folders under that package when it starts.

## React/Vite frontend

The frontend is a separate application under `src/`:

```bash
npm install
npm run dev
```

`src/main.tsx` starts the frontend and `src/App.tsx` is its application shell.

## Repository layout

```text
.
├── main.py                     # Python compatibility launcher
├── requirements.txt            # Python dependencies
├── SmartTimetable/             # Python desktop application package
│   ├── __init__.py
│   ├── __main__.py             # `python -m SmartTimetable`
│   ├── main.py                 # Window and screen navigation
│   ├── config.py               # Paths, app metadata, theme constants
│   ├── database.py             # SQLite schema and CRUD operations
│   ├── utils.py                # Validation and scheduling helpers
│   ├── login.py, register.py   # Authentication screens
│   ├── dashboard.py            # Productivity dashboard
│   ├── timetable.py            # Timetable management and generation
│   ├── subjects.py             # Subject and faculty directory
│   ├── attendance.py           # Attendance tracking and prediction
│   ├── assignments.py          # Assignment tracker
│   ├── examplanner.py          # Exam and revision planner
│   ├── studyplanner.py         # Study planner and Pomodoro timer
│   ├── notifications.py        # Alerts and reminders
│   ├── reports.py              # PDF and Excel exports
│   ├── profile.py              # Student profile
│   ├── settings.py             # Theme and backup settings
│   ├── assets/                 # Desktop app assets
│   ├── database/               # Local SQLite database
│   ├── exports/                # Generated exports
│   └── reports/                # Generated reports
├── src/                        # React/Vite frontend
│   ├── components/             # UI feature screens and shared components
│   ├── data/                   # Frontend sample data
│   ├── App.tsx                 # Frontend application shell
│   ├── main.tsx                # Frontend entry point
│   └── index.css               # Global styles
├── index.html                  # Vite HTML entry point
├── package.json                # JavaScript scripts and dependencies
└── vite.config.ts              # Vite configuration
```
