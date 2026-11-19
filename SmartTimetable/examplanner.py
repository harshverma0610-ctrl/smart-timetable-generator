import customtkinter as ctk
from datetime import datetime
from tkinter import messagebox
from .database import db

class ExamPlannerFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="Exam Scheduler & Revision Planner", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        add_btn = ctk.CTkButton(
            header,
            text="🎯 Schedule Exam",
            fg_color="#8b5cf6",
            hover_color="#7c3aed",
            height=38,
            font=ctk.CTkFont(size=13, weight="bold"),
            command=self.open_add_dialog
        )
        add_btn.pack(side="right", padx=15, pady=15)

        self.scroll = ctk.CTkScrollableFrame(self, fg_color="transparent")
        self.scroll.pack(fill="both", expand=True, padx=10, pady=5)

        self.load_exams()

    def load_exams(self):
        for w in self.scroll.winfo_children():
            w.destroy()

        exams = db.fetch_all('''
            SELECT e.*, s.name as sub_name, s.code as sub_code 
            FROM exams e 
            JOIN subjects s ON e.subject_id = s.id 
            WHERE e.user_id = ?
            ORDER BY e.date ASC
        ''', (self.user['id'],))

        if not exams:
            lbl = ctk.CTkLabel(self.scroll, text="No upcoming exams scheduled. Click 'Schedule Exam' to add your exam schedule.", text_color="#64748b")
            lbl.pack(pady=40)
            return

        for ex in exams:
            card = ctk.CTkFrame(self.scroll, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
            card.pack(fill="x", pady=6)

            info = ctk.CTkFrame(card, fg_color="transparent")
            info.pack(side="left", padx=15, pady=12)

            name_lbl = ctk.CTkLabel(info, text=f"{ex['sub_name']} ({ex['sub_code']})", font=ctk.CTkFont(size=16, weight="bold"))
            name_lbl.pack(anchor="w")

            meta = ctk.CTkLabel(info, text=f"📅 Date: {ex['date']} | ⏰ Time: {ex['time']} | 🏫 Venue: {ex['venue']}", text_color="#94a3b8")
            meta.pack(anchor="w")

            syl = ctk.CTkLabel(info, text=f"📚 Syllabus: {ex['syllabus'] or 'Full Course Syllabus'}", text_color="#64748b")
            syl.pack(anchor="w", pady=(2, 0))

            # Calculate days left
            try:
                ex_date = datetime.strptime(ex['date'], "%Y-%m-%d")
                days_left = (ex_date - datetime.now()).days
                cnt_str = f"⏳ {max(0, days_left)} Days Left"
            except Exception:
                cnt_str = "Exam Scheduled"

            cnt_lbl = ctk.CTkLabel(card, text=cnt_str, font=ctk.CTkFont(size=14, weight="bold"), text_color="#8b5cf6")
            cnt_lbl.pack(side="right", padx=20, pady=12)

    def open_add_dialog(self):
        subjects = db.fetch_all("SELECT * FROM subjects WHERE user_id = ?", (self.user['id'],))
        if not subjects:
            messagebox.showwarning("Warning", "Add subjects first!")
            return

        dialog = ctk.CTkToplevel(self)
        dialog.title("Schedule Exam")
        dialog.geometry("400x420")
        dialog.grab_set()

        lbl = ctk.CTkLabel(dialog, text="Schedule Exam Entry", font=ctk.CTkFont(size=16, weight="bold"))
        lbl.pack(pady=15)

        sub_names = [f"{s['name']} ({s['code']})" for s in subjects]
        sub_cb = ctk.CTkOptionMenu(dialog, values=sub_names, width=320)
        sub_cb.pack(pady=6)

        dt_e = ctk.CTkEntry(dialog, placeholder_text="Exam Date (YYYY-MM-DD)", width=320)
        dt_e.pack(pady=6)

        tm_e = ctk.CTkEntry(dialog, placeholder_text="Time (e.g. 10:00 AM - 01:00 PM)", width=320)
        tm_e.pack(pady=6)

        ven_e = ctk.CTkEntry(dialog, placeholder_text="Venue / Hall Number", width=320)
        ven_e.pack(pady=6)

        syl_e = ctk.CTkEntry(dialog, placeholder_text="Syllabus Topics Covered", width=320)
        syl_e.pack(pady=6)

        def save():
            selected_idx = sub_names.index(sub_cb.get())
            sub_id = subjects[selected_idx]['id']
            dt = dt_e.get().strip()
            tm = tm_e.get().strip()
            ven = ven_e.get().strip()
            syl = syl_e.get().strip()

            if not dt or not tm:
                messagebox.showerror("Error", "Date and Time are required!")
                return

            db.execute_query('''
                INSERT INTO exams (user_id, subject_id, date, time, venue, syllabus)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (self.user['id'], sub_id, dt, tm, ven, syl))

            dialog.destroy()
            self.load_exams()

        btn = ctk.CTkButton(dialog, text="Save Exam Schedule", fg_color="#8b5cf6", hover_color="#7c3aed", width=320, command=save)
        btn.pack(pady=20)
