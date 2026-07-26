# Smart Timetable Generator & Student Productivity System 🎓⚡

A modern, commercial-grade desktop and web application designed to eliminate academic friction for university students. Manages course schedules, automatic constraint-based timetable generation, subject workloads, assignment deadlines, attendance tracking with predictive analytics, exam revision schedules, and Pomodoro focus study sessions.

---

## 🌟 Key Features

- **⚡ Automatic Smart Timetable Generator**:
  - Zero teacher or classroom conflict solver
  - Avoids back-to-back difficult subjects
  - Auto-balances weekly student credit workload
  - Includes dedicated lunch break slots and lab durations
- **📊 Attendance Tracker & Predictor**:
  - Live percentage tracking with 75% threshold warnings
  - Predictive engine calculating exact number of future classes needed to recover attendance
  - Breakdown by subject and semester
- **📝 Assignment & Exam Planner**:
  - Real-time countdown timers
  - Priority flags (High, Medium, Low) with syllabus tracking
- **⏱️ Smart Study Planner & Pomodoro Timer**:
  - AI-weighted study goal generator focusing on weak subjects and upcoming exams
  - Integrated Pomodoro focus timer with break intervals
- **📄 Reports & QR Sharing**:
  - PDF academic timetable reports and Excel workbook exports
  - QR Code generator for sharing timetables with classmates
- **⚙️ Desktop CustomTkinter GUI + Web Dual System**:
  - Dark/Light mode theme switching
  - SQLite database backing with full CRUD capability

---

## 🛠️ Tech Stack & Dependencies

- **Language**: Python 3.12+ / TypeScript + React 19
- **GUI Engine**: CustomTkinter / Tailwind CSS + Lucide Icons
- **Database**: SQLite 3
- **Libraries**:
  - `customtkinter` (Modern Python Desktop UI)
  - `sqlite3` (Relational persistence)
  - `matplotlib` & `pandas` (Analytical charts & productivity trends)
  - `reportlab` & `openpyxl` (PDF report & Excel export engine)
  - `qrcode[pil]` (Mobile timetable QR code sharing)

---

## 📐 Database Schema & ER Diagram

```
+------------------+       +-------------------+       +---------------------+
|      USERS       |       |     SUBJECTS      |       |      TIMETABLE      |
+------------------+       +-------------------+       +---------------------+
| id (PK)          |<----->| id (PK)           |<----->| id (PK)             |
| name             |  1:N  | user_id (FK)      |  1:N  | user_id (FK)        |
| roll_number      |       | code              |       | subject_id (FK)     |
| department       |       | name              |       | day                 |
| semester         |       | faculty           |       | slot                |
| email            |       | credits           |       | room                |
| username         |       | color_label       |       | slot_type           |
| password_hash    |       | difficulty        |       +---------------------+
+------------------+       +-------------------+
        |                            |
        | 1:N                        | 1:N
        v                            v
+------------------+       +-------------------+
|   ASSIGNMENTS    |       |    ATTENDANCE     |
+------------------+       +-------------------+
| id (PK)          |       | id (PK)           |
| user_id (FK)     |       | user_id (FK)      |
| subject_id (FK)  |       | subject_id (FK)   |
| title            |       | date              |
| deadline         |       | status            |
| status           |       +-------------------+
+------------------+
```

---

## 🚀 Quick Start Guide (Running Desktop Application)

1. **Clone & Setup Environment**:
   ```bash
   git clone https://github.com/student-tools/smart-timetable.git
   cd smart-timetable
   ```

2. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Launch Application**:
   ```bash
   python main.py
   ```

---

## 🏆 Project Structure

```
SmartTimetable/
├── main.py              # Application Entrypoint & Navigation Orchestrator
├── database.py          # SQLite Schema & CRUD Manager
├── config.py            # Global Config & Theme Constants
├── login.py             # User Authentication Screen
├── register.py          # Student Registration & Input Validations
├── dashboard.py         # Main Productivity Hub
├── timetable.py         # Constraint-Based Timetable Generator
├── subjects.py          # Subject & Faculty Directory
├── attendance.py        # Attendance Tracker & Prediction Calculator
├── assignments.py       # Assignment Kanban Tracker
├── examplanner.py       # Exam Countdown & Revision Planner
├── studyplanner.py      # Smart Study Planner & Pomodoro Timer
├── notifications.py     # System Alerts & Reminders
├── reports.py           # PDF & Excel Report Generator
├── profile.py           # Student Profile & Achievements
├── settings.py          # Dark/Light Mode & Database Backups
├── utils.py             # Validation Rules & Constraint Solver Engine
└── requirements.txt     # Dependency Declarations
```
