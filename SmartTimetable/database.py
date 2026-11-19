import sqlite3
import hashlib
import os
from .config import DB_PATH

class DatabaseManager:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        print("Using database:", os.path.abspath(self.db_path))
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        conn = self.get_connection()
        cursor = conn.cursor()

        # Users table
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
                cgpa REAL DEFAULT 0.0,
                skills TEXT DEFAULT '',
                goals TEXT DEFAULT '',
                achievements TEXT DEFAULT '',
                photo_path TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Subjects table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                code TEXT NOT NULL,
                name TEXT NOT NULL,
                faculty TEXT NOT NULL,
                credits INTEGER DEFAULT 3,
                classroom TEXT DEFAULT '',
                teacher_email TEXT DEFAULT '',
                color_label TEXT DEFAULT '#3b82f6',
                difficulty TEXT DEFAULT 'Medium',
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')

        # Timetable table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS timetable (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                day TEXT NOT NULL,
                slot TEXT NOT NULL,
                subject_id INTEGER NOT NULL,
                room TEXT DEFAULT '',
                faculty TEXT DEFAULT '',
                slot_type TEXT DEFAULT 'Lecture',
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE
            )
        ''')

        # Assignments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS assignments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                subject_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                deadline TEXT NOT NULL,
                priority TEXT DEFAULT 'Medium',
                status TEXT DEFAULT 'Pending',
                marks INTEGER DEFAULT 100,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE
            )
        ''')

        # Attendance table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                subject_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                status TEXT NOT NULL, -- Present, Absent, Late, Medical
                notes TEXT DEFAULT '',
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE
            )
        ''')

        # Exams table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS exams (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                subject_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                venue TEXT DEFAULT '',
                syllabus TEXT DEFAULT '',
                status TEXT DEFAULT 'Upcoming',
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE
            )
        ''')

        # Study Sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS study_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                subject_id INTEGER NOT NULL,
                duration_minutes INTEGER NOT NULL,
                session_date TEXT NOT NULL,
                notes TEXT DEFAULT '',
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE
            )
        ''')

        # Notifications table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                category TEXT DEFAULT 'General',
                is_read INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')

        # Settings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                theme TEXT DEFAULT 'Dark',
                accent_color TEXT DEFAULT 'Blue',
                notifications_enabled INTEGER DEFAULT 1,
                sound_enabled INTEGER DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')

        conn.commit()
        conn.close()

    # User Auth CRUD
    def register_user(self, name, roll_number, department, semester, section, email, phone, username, password):
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute('''
                INSERT INTO users (name, roll_number, department, semester, section, email, phone, username, password_hash)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, roll_number, department, semester, section, email, phone, username, password_hash))
            user_id = cursor.lastrowid
            cursor.execute('INSERT INTO settings (user_id) VALUES (?)', (user_id,))
            conn.commit()
            return user_id
        except sqlite3.IntegrityError as e:
            return None
        finally:
            conn.close()

    def login_user(self, username, password):
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE (username = ? OR email = ?) AND password_hash = ?', (username, username, password_hash))
        user = cursor.fetchone()
        conn.close()
        return dict(user) if user else None

    # Helper execution query
    def execute_query(self, query, params=()):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        last_id = cursor.lastrowid
        conn.close()
        return last_id

    def fetch_all(self, query, params=()):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return rows

    def fetch_one(self, query, params=()):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

# Singleton DB Instance
db = DatabaseManager()
