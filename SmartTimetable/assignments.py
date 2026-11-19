import customtkinter as ctk
from datetime import datetime
from tkinter import messagebox
from .database import db

class AssignmentsFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="Assignment Tracker", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        add_btn = ctk.CTkButton(
            header,
            text="📝 Add Assignment",
            fg_color="#f59e0b",
            hover_color="#d97706",
            height=38,
            font=ctk.CTkFont(size=13, weight="bold"),
            command=self.open_add_dialog
        )
        add_btn.pack(side="right", padx=15, pady=15)

        self.scroll = ctk.CTkScrollableFrame(self, fg_color="transparent")
        self.scroll.pack(fill="both", expand=True, padx=10, pady=5)

        self.load_assignments()

    def load_assignments(self):
        for w in self.scroll.winfo_children():
            w.destroy()

        assignments = db.fetch_all('''
            SELECT a.*, s.name as sub_name, s.code as sub_code 
            FROM assignments a 
            JOIN subjects s ON a.subject_id = s.id 
            WHERE a.user_id = ?
            ORDER BY a.deadline ASC
        ''', (self.user['id'],))

        if not assignments:
            lbl = ctk.CTkLabel(self.scroll, text="No assignments currently. Click 'Add Assignment' to create one.", text_color="#64748b")
            lbl.pack(pady=40)
            return

        for assign in assignments:
            card = ctk.CTkFrame(self.scroll, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
            card.pack(fill="x", pady=6)

            info = ctk.CTkFrame(card, fg_color="transparent")
            info.pack(side="left", padx=15, pady=12)

            title_lbl = ctk.CTkLabel(info, text=f"{assign['title']} - [{assign['sub_name']}]", font=ctk.CTkFont(size=15, weight="bold"))
            title_lbl.pack(anchor="w")

            meta = ctk.CTkLabel(info, text=f"📅 Deadline: {assign['deadline']} | 🔥 Priority: {assign['priority']} | 💯 Marks: {assign['marks']}", text_color="#94a3b8")
            meta.pack(anchor="w")

            desc = ctk.CTkLabel(info, text=assign['description'] or "No additional description.", text_color="#64748b")
            desc.pack(anchor="w", pady=(2, 0))

            status_color = "#22c55e" if assign['status'] == "Completed" else "#f59e0b"
            status_btn = ctk.CTkButton(
                card, 
                text=assign['status'], 
                fg_color=status_color,
                width=100,
                command=lambda a_id=assign['id'], st=assign['status']: self.toggle_status(a_id, st)
            )
            status_btn.pack(side="right", padx=15, pady=12)

    def open_add_dialog(self):
        subjects = db.fetch_all("SELECT * FROM subjects WHERE user_id = ?", (self.user['id'],))
        if not subjects:
            messagebox.showwarning("Warning", "Add subjects first!")
            return

        dialog = ctk.CTkToplevel(self)
        dialog.title("Add Assignment")
        dialog.geometry("400x480")
        dialog.grab_set()

        lbl = ctk.CTkLabel(dialog, text="Add New Assignment", font=ctk.CTkFont(size=16, weight="bold"))
        lbl.pack(pady=15)

        sub_names = [f"{s['name']} ({s['code']})" for s in subjects]
        sub_cb = ctk.CTkOptionMenu(dialog, values=sub_names, width=320)
        sub_cb.pack(pady=6)

        title_e = ctk.CTkEntry(dialog, placeholder_text="Assignment Title", width=320)
        title_e.pack(pady=6)

        desc_e = ctk.CTkEntry(dialog, placeholder_text="Description / Instructions", width=320)
        desc_e.pack(pady=6)

        dl_e = ctk.CTkEntry(dialog, placeholder_text="Deadline (YYYY-MM-DD)", width=320)
        dl_e.insert(0, datetime.now().strftime("%Y-%m-%d"))
        dl_e.pack(pady=6)

        prio_cb = ctk.CTkOptionMenu(dialog, values=["Low", "Medium", "High"], width=320)
        prio_cb.set("High")
        prio_cb.pack(pady=6)

        marks_e = ctk.CTkEntry(dialog, placeholder_text="Total Marks (e.g. 100)", width=320)
        marks_e.pack(pady=6)

        def save():
            selected_idx = sub_names.index(sub_cb.get())
            sub_id = subjects[selected_idx]['id']
            title = title_e.get().strip()
            desc = desc_e.get().strip()
            deadline = dl_e.get().strip()
            prio = prio_cb.get()
            try:
                marks = int(marks_e.get().strip())
            except ValueError:
                marks = 100

            if not title or not deadline:
                messagebox.showerror("Error", "Title and Deadline are required!")
                return

            db.execute_query('''
                INSERT INTO assignments (user_id, subject_id, title, description, deadline, priority, status, marks)
                VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)
            ''', (self.user['id'], sub_id, title, desc, deadline, prio, marks))

            dialog.destroy()
            self.load_assignments()

        btn = ctk.CTkButton(dialog, text="Create Assignment", fg_color="#22c55e", hover_color="#16a34a", width=320, command=save)
        btn.pack(pady=20)

    def toggle_status(self, a_id, curr_status):
        new_status = "Completed" if curr_status != "Completed" else "Pending"
        db.execute_query("UPDATE assignments SET status = ? WHERE id = ? AND user_id = ?", (new_status, a_id, self.user['id']))
        self.load_assignments()
