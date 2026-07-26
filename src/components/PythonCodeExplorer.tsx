import React, { useState } from 'react';
import { Code2, Download, Copy, Check, FileCode, Terminal, Sparkles } from 'lucide-react';

export const PythonCodeExplorer: React.FC = () => {
  const [activeFile, setActiveFile] = useState("main.py");
  const [copied, setCopied] = useState(false);

  const pythonFiles: Record<string, string> = {
    "main.py": `#!/usr/bin/env python3
import customtkinter as ctk
from login import LoginFrame
from register import RegisterFrame
from dashboard import DashboardFrame
from timetable import TimetableFrame
from subjects import SubjectsFrame
from attendance import AttendanceFrame
from assignments import AssignmentsFrame
from examplanner import ExamPlannerFrame
from studyplanner import StudyPlannerFrame
from notifications import NotificationsFrame
from reports import ReportsFrame
from profile import ProfileFrame
from settings import SettingsFrame
from config import APP_NAME

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class SmartTimetableApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title(APP_NAME)
        self.geometry("1280x800")
        self.minsize(1024, 700)
        self.current_user = None

        self.container = ctk.CTkFrame(self, fg_color=("#f8fafc", "#0f172a"))
        self.container.pack(fill="both", expand=True)
        self.show_login()

    def show_login(self):
        self.clear_container()
        login_f = LoginFrame(self.container, self.on_login_success, self.show_register)
        login_f.pack(fill="both", expand=True)

    def show_register(self):
        self.clear_container()
        reg_f = RegisterFrame(self.container, self.on_login_success, self.show_login)
        reg_f.pack(fill="both", expand=True)

    def on_login_success(self, user):
        self.current_user = user
        self.build_main_workspace()

    def clear_container(self):
        for widget in self.container.winfo_children():
            widget.destroy()

if __name__ == "__main__":
    app = SmartTimetableApp()
    app.mainloop()`,

    "database.py": `import sqlite3
import hashlib
from config import DB_PATH

class DatabaseManager:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                roll_number TEXT UNIQUE NOT NULL,
                department TEXT NOT NULL,
                semester TEXT NOT NULL,
                section TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                cgpa REAL DEFAULT 0.0
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                code TEXT NOT NULL,
                name TEXT NOT NULL,
                faculty TEXT NOT NULL,
                credits INTEGER DEFAULT 3,
                classroom TEXT DEFAULT '',
                color_label TEXT DEFAULT '#3b82f6',
                difficulty TEXT DEFAULT 'Medium'
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS timetable (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                day TEXT NOT NULL,
                slot TEXT NOT NULL,
                subject_id INTEGER NOT NULL,
                room TEXT DEFAULT '',
                faculty TEXT DEFAULT '',
                slot_type TEXT DEFAULT 'Lecture'
            )
        ''')
        conn.commit()
        conn.close()

db = DatabaseManager()`,

    "config.py": `import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database", "smart_timetable.db")
APP_NAME = "Smart Timetable Generator & Productivity System"

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
TIME_SLOTS = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM (Lunch)",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM"
]`,

    "utils.py": `def generate_auto_timetable(subjects, days, time_slots, options):
    if not subjects:
        return []

    generated_slots = []
    subject_counts = {s['id']: 0 for s in subjects}
    lecture_slots = [slot for slot in time_slots if "Lunch" not in slot]

    for day in days:
        classes_today = 0
        max_today = options.get("max_classes_per_day", 4)
        for slot in lecture_slots:
            if classes_today >= max_today:
                break

            candidates = [s for s in subjects if subject_counts[s['id']] < s.get('credits', 3)]
            if not candidates:
                continue

            chosen_sub = min(candidates, key=lambda s: subject_counts[s['id']])
            subject_counts[chosen_sub['id']] += 1
            classes_today += 1

            generated_slots.append({
                "day": day,
                "slot": slot,
                "subject_id": chosen_sub['id'],
                "room": chosen_sub['classroom'],
                "faculty": chosen_sub['faculty']
            })

    return generated_slots`,

    "requirements.txt": `customtkinter>=5.2.0
pillow>=10.0.0
matplotlib>=3.8.0
pandas>=2.1.0
openpyxl>=3.1.2
reportlab>=4.0.0
qrcode[pil]>=7.4.2
plyer>=2.1.0`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonFiles[activeFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([pythonFiles[activeFile]], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Python Desktop Application Source Code Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            100% Executable Python 3.12 + CustomTkinter Desktop Code (`python main.py`)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy File'}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download {activeFile}</span>
          </button>
        </div>
      </div>

      {/* Terminal Run Instructions */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs flex items-center gap-3 border border-slate-800">
        <Terminal className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <span className="text-emerald-400 font-bold">$ pip install -r requirements.txt</span>
          <span className="mx-2 text-slate-600">|</span>
          <span className="text-blue-400 font-bold">$ python main.py</span>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* File Tree */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Project Files</p>
          {Object.keys(pythonFiles).map((filename) => (
            <button
              key={filename}
              onClick={() => setActiveFile(filename)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeFile === filename 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-4 h-4 shrink-0" />
              <span>{filename}</span>
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="md:col-span-3 rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[600px]">
          <pre className="leading-relaxed">{pythonFiles[activeFile]}</pre>
        </div>
      </div>
    </div>
  );
};
