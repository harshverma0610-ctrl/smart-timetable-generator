import customtkinter as ctk
from datetime import datetime
from tkinter import messagebox
from database import db
from utils import calculate_attendance_stats

class AttendanceFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="Attendance Tracker & Predictor", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        mark_btn = ctk.CTkButton(
            header,
            text="📌 Mark Today's Attendance",
            fg_color="#3b82f6",
            hover_color="#2563eb",
            height=38,
            font=ctk.CTkFont(size=13, weight="bold"),
            command=self.open_mark_dialog
        )
        mark_btn.pack(side="right", padx=15, pady=15)

        # Content List
        self.scroll = ctk.CTkScrollableFrame(self, fg_color="transparent")
        self.scroll.pack(fill="both", expand=True, padx=10, pady=5)

        self.load_attendance_data()

    def load_attendance_data(self):
        for w in self.scroll.winfo_children():
            w.destroy()

        subjects = db.fetch_all("SELECT * FROM subjects WHERE user_id = ?", (self.user['id'],))

        if not subjects:
            lbl = ctk.CTkLabel(self.scroll, text="No subjects available. Please add subjects first.", text_color="#64748b")
            lbl.pack(pady=40)
            return

        for sub in subjects:
            records = db.fetch_all("SELECT * FROM attendance WHERE user_id = ? AND subject_id = ?", (self.user['id'], sub['id']))
            stats = calculate_attendance_stats(records)

            card = ctk.CTkFrame(self.scroll, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
            card.pack(fill="x", pady=6)

            info = ctk.CTkFrame(card, fg_color="transparent")
            info.pack(side="left", padx=15, pady=12)

            name_lbl = ctk.CTkLabel(info, text=f"{sub['name']} ({sub['code']})", font=ctk.CTkFont(size=16, weight="bold"))
            name_lbl.pack(anchor="w")

            status_str = (
    f"Present: {stats.get('present', 0)} | "
    f"Absent: {stats.get('absent', 0)} | "
    f"Late: {stats.get('late', 0)} | "
    f"Total: {stats.get('total', 0)}"
)
            meta = ctk.CTkLabel(info, text=status_str, text_color="#94a3b8")
            meta.pack(anchor="w")

            if stats['percentage'] < 75.0:
                pred_str = f"⚠️ WARNING: Attendance is {stats['percentage']}%. Attend next {stats['target_classes_needed']} classes to reach 75% target!"
                warn_lbl = ctk.CTkLabel(info, text=pred_str, text_color="#ef4444", font=ctk.CTkFont(size=11, weight="bold"))
                warn_lbl.pack(anchor="w", pady=(2, 0))

            pct_lbl = ctk.CTkLabel(
                card, 
                text=f"{stats['percentage']}%", 
                font=ctk.CTkFont(size=22, weight="bold"),
                text_color="#22c55e" if stats['percentage'] >= 75 else "#ef4444"
            )
            pct_lbl.pack(side="right", padx=20, pady=12)

    def open_mark_dialog(self):
        subjects = db.fetch_all("SELECT * FROM subjects WHERE user_id = ?", (self.user['id'],))
        if not subjects:
            messagebox.showwarning("Warning", "Add subjects first!")
            return

        dialog = ctk.CTkToplevel(self)
        dialog.title("Mark Attendance")
        dialog.geometry("380x320")
        dialog.grab_set()

        lbl = ctk.CTkLabel(dialog, text="Mark Class Attendance", font=ctk.CTkFont(size=16, weight="bold"))
        lbl.pack(pady=15)

        sub_names = [f"{s['name']} ({s['code']})" for s in subjects]
        sub_cb = ctk.CTkOptionMenu(dialog, values=sub_names, width=300)
        sub_cb.pack(pady=10)

        status_cb = ctk.CTkOptionMenu(dialog, values=["Present", "Absent", "Late", "Medical"], width=300)
        status_cb.set("Present")
        status_cb.pack(pady=10)

        def save():
            selected_idx = sub_names.index(sub_cb.get())
            sub_id = subjects[selected_idx]['id']
            status = status_cb.get()
            today_str = datetime.now().strftime("%Y-%m-%d")

            db.execute_query('''
                INSERT INTO attendance (user_id, subject_id, date, status)
                VALUES (?, ?, ?, ?)
            ''', (self.user['id'], sub_id, today_str, status))

            dialog.destroy()
            self.load_attendance_data()

        btn = ctk.CTkButton(dialog, text="Save Record", fg_color="#22c55e", hover_color="#16a34a", width=300, command=save)
        btn.pack(pady=20)
