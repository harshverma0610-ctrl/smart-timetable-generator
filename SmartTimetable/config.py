import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "database")
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
EXPORTS_DIR = os.path.join(BASE_DIR, "exports")

# Ensure directories exist
for directory in [DB_DIR, ASSETS_DIR, REPORTS_DIR, EXPORTS_DIR]:
    os.makedirs(directory, exist_ok=True)

DB_PATH = os.path.join(DB_DIR, "smart_timetable.db")

# Application Details
APP_NAME = "Smart Timetable Generator & Productivity System"
APP_VERSION = "2.5.0"
APP_AUTHOR = "Senior Student Engineering Team"

# Theme Colors (CustomTkinter)
DARK_THEME = {
    "bg": "#0f172a",
    "card_bg": "#1e293b",
    "sidebar_bg": "#0f172a",
    "accent": "#3b82f6",
    "accent_hover": "#2563eb",
    "text": "#f8fafc",
    "subtext": "#94a3b8",
    "border": "#334155",
    "success": "#22c55e",
    "warning": "#f59e0b",
    "danger": "#ef4444",
}

LIGHT_THEME = {
    "bg": "#f8fafc",
    "card_bg": "#ffffff",
    "sidebar_bg": "#1e293b",
    "accent": "#2563eb",
    "accent_hover": "#1d4ed8",
    "text": "#0f172a",
    "subtext": "#64748b",
    "border": "#e2e8f0",
    "success": "#16a34a",
    "warning": "#d97706",
    "danger": "#dc2626",
}

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
TIME_SLOTS = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM (Lunch)",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM"
]
