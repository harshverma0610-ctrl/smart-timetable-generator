import customtkinter as ctk
from tkinter import messagebox
from .database import db

class SubjectsFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        # Header
        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="Subject Management", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        add_btn = ctk.CTkButton(
            header,
            text="➕ Add New Subject",
            fg_color="#3b82f6",
            hover_color="#2563eb",
            height=38,
            font=ctk.CTkFont(size=13, weight="bold"),
            command=self.open_add_dialog
        )
        add_btn.pack(side="right", padx=15, pady=15)

        # Subject List
        self.scroll = ctk.CTkScrollableFrame(self, fg_color="transparent")
        self.scroll.pack(fill="both", expand=True, padx=10, pady=5)

        self.load_subjects()

    def load_subjects(self):
        for w in self.scroll.winfo_children():
            w.destroy()

        subjects = db.fetch_all("SELECT * FROM subjects WHERE user_id = ?", (self.user['id'],))

        if not subjects:
            lbl = ctk.CTkLabel(self.scroll, text="No subjects added yet. Click 'Add New Subject' to start.", text_color="#64748b")
            lbl.pack(pady=40)
            return

        for sub in subjects:
            card = ctk.CTkFrame(self.scroll, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
            card.pack(fill="x", pady=6)

            left = ctk.CTkFrame(card, fg_color="transparent")
            left.pack(side="left", padx=15, pady=12)

            # Color pill badge
            badge = ctk.CTkFrame(left, width=12, height=45, fg_color=sub['color_label'], corner_radius=6)
            badge.pack(side="left", padx=(0, 15))

            info = ctk.CTkFrame(left, fg_color="transparent")
            info.pack(side="left")

            name_lbl = ctk.CTkLabel(info, text=f"{sub['name']} ({sub['code']})", font=ctk.CTkFont(size=15, weight="bold"))
            name_lbl.pack(anchor="w")

            meta = ctk.CTkLabel(info, text=f"👨‍🏫 {sub['faculty']} | 🏫 Room: {sub['classroom']} | 🎯 Credits: {sub['credits']} | ⚡ Difficulty: {sub['difficulty']}", text_color="#94a3b8")
            meta.pack(anchor="w")

            del_btn = ctk.CTkButton(
                card,
                text="Delete",
                fg_color="#ef4444",
                hover_color="#dc2626",
                width=80,
                height=32,
                command=lambda s_id=sub['id']: self.delete_subject(s_id)
            )
            del_btn.pack(side="right", padx=15, pady=12)

    def open_add_dialog(self):
        dialog = ctk.CTkToplevel(self)
        dialog.title("Add Subject")
        dialog.geometry("400x500")
        dialog.grab_set()

        lbl = ctk.CTkLabel(dialog, text="Add New Subject", font=ctk.CTkFont(size=18, weight="bold"))
        lbl.pack(pady=15)

        code_e = ctk.CTkEntry(dialog, placeholder_text="Subject Code (e.g. CS501)", width=320)
        code_e.pack(pady=6)

        name_e = ctk.CTkEntry(dialog, placeholder_text="Subject Name (e.g. Operating Systems)", width=320)
        name_e.pack(pady=6)

        fac_e = ctk.CTkEntry(dialog, placeholder_text="Faculty Name", width=320)
        fac_e.pack(pady=6)

        room_e = ctk.CTkEntry(dialog, placeholder_text="Classroom / Lab Venue", width=320)
        room_e.pack(pady=6)

        cred_e = ctk.CTkEntry(dialog, placeholder_text="Credit Hours (e.g. 3 or 4)", width=320)
        cred_e.pack(pady=6)

        diff_cb = ctk.CTkOptionMenu(dialog, values=["Easy", "Medium", "Hard"], width=320)
        diff_cb.set("Medium")
        diff_cb.pack(pady=6)

        color_cb = ctk.CTkOptionMenu(dialog, values=["#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899"], width=320)
        color_cb.set("#3b82f6")
        color_cb.pack(pady=6)

        def save():
            code = code_e.get().strip()
            name = name_e.get().strip()
            fac = fac_e.get().strip()
            room = room_e.get().strip()
            try:
                cred = int(cred_e.get().strip())
            except ValueError:
                cred = 3

            if not code or not name:
                messagebox.showerror("Error", "Code and Name are required!")
                return

            db.execute_query('''
                INSERT INTO subjects (user_id, code, name, faculty, credits, classroom, color_label, difficulty)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (self.user['id'], code, name, fac, cred, room, color_cb.get(), diff_cb.get()))

            dialog.destroy()
            self.load_subjects()

        save_btn = ctk.CTkButton(dialog, text="Save Subject", fg_color="#22c55e", hover_color="#16a34a", width=320, command=save)
        save_btn.pack(pady=20)

    def delete_subject(self, sub_id):
        if messagebox.askyesno("Confirm", "Are you sure you want to delete this subject?"):
            db.execute_query("DELETE FROM subjects WHERE id = ? AND user_id = ?", (sub_id, self.user['id']))
            self.load_subjects()
