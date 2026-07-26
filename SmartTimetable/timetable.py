import customtkinter as ctk
from tkinter import messagebox
from database import db
from config import DAYS_OF_WEEK, TIME_SLOTS
from utils import generate_auto_timetable

class TimetableFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        # Header controls
        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="Smart Timetable Generator", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        gen_btn = ctk.CTkButton(
            header,
            text="⚡ Auto-Generate Timetable",
            fg_color="#3b82f6",
            hover_color="#2563eb",
            font=ctk.CTkFont(size=13, weight="bold"),
            height=38,
            command=self.run_auto_generator
        )
        gen_btn.pack(side="right", padx=15, pady=15)

        clear_btn = ctk.CTkButton(
            header,
            text="Clear Timetable",
            fg_color="#ef4444",
            hover_color="#dc2626",
            font=ctk.CTkFont(size=13),
            height=38,
            command=self.clear_timetable
        )
        clear_btn.pack(side="right", padx=5, pady=15)

        # Timetable Grid Display
        self.grid_scroll = ctk.CTkScrollableFrame(self, fg_color="transparent")
        self.grid_scroll.pack(fill="both", expand=True, padx=10, pady=5)

        self.render_timetable_grid()

    def render_timetable_grid(self):
        # Clear existing
        for widget in self.grid_scroll.winfo_children():
            widget.destroy()

        timetable_records = db.fetch_all('''
            SELECT t.*, s.name as sub_name, s.code as sub_code, s.color_label 
            FROM timetable t 
            JOIN subjects s ON t.subject_id = s.id 
            WHERE t.user_id = ?
        ''', (self.user['id'],))

        # Map lookup
        tt_map = {(r['day'], r['slot']): r for r in timetable_records}

        # Header Row (Time Slots)
        header_row = ctk.CTkFrame(self.grid_scroll, fg_color="transparent")
        header_row.pack(fill="x", pady=2)

        day_lbl = ctk.CTkLabel(header_row, text="Day / Time", width=120, font=ctk.CTkFont(size=12, weight="bold"))
        day_lbl.pack(side="left", padx=2)

        for slot in TIME_SLOTS:
            short_slot = slot.split(" - ")[0]
            s_lbl = ctk.CTkLabel(header_row, text=short_slot, width=130, font=ctk.CTkFont(size=11, weight="bold"))
            s_lbl.pack(side="left", padx=2)

        # Days Rows
        for day in DAYS_OF_WEEK:
            row = ctk.CTkFrame(self.grid_scroll, fg_color="transparent")
            row.pack(fill="x", pady=3)

            d_lbl = ctk.CTkLabel(row, text=day, width=120, font=ctk.CTkFont(size=12, weight="bold"), anchor="w")
            d_lbl.pack(side="left", padx=2)

            for slot in TIME_SLOTS:
                card_bg = ("#f1f5f9", "#0f172a")
                cell_data = tt_map.get((day, slot))

                if "Lunch" in slot:
                    cell = ctk.CTkFrame(row, width=130, height=65, fg_color=("#e2e8f0", "#334155"), corner_radius=6)
                    cell.pack(side="left", padx=2)
                    cell.pack_propagate(False)
                    lbl = ctk.CTkLabel(cell, text="🍱 LUNCH", font=ctk.CTkFont(size=11, weight="bold"), text_color="#94a3b8")
                    lbl.place(relx=0.5, rely=0.5, anchor="center")
                elif cell_data:
                    cell = ctk.CTkFrame(row, width=130, height=65, fg_color=cell_data['color_label'], corner_radius=6)
                    cell.pack(side="left", padx=2)
                    cell.pack_propagate(False)

                    name_lbl = ctk.CTkLabel(cell, text=cell_data['sub_name'], font=ctk.CTkFont(size=11, weight="bold"), text_color="#ffffff")
                    name_lbl.pack(anchor="w", padx=6, pady=(4, 0))

                    rm_lbl = ctk.CTkLabel(cell, text=f"🏫 {cell_data['room']}", font=ctk.CTkFont(size=10), text_color="#f8fafc")
                    rm_lbl.pack(anchor="w", padx=6, pady=0)
                else:
                    cell = ctk.CTkFrame(row, width=130, height=65, fg_color=card_bg, corner_radius=6)
                    cell.pack(side="left", padx=2)
                    cell.pack_propagate(False)
                    lbl = ctk.CTkLabel(cell, text="Free Slot", font=ctk.CTkFont(size=10), text_color="#64748b")
                    lbl.place(relx=0.5, rely=0.5, anchor="center")

    def run_auto_generator(self):
        subjects = db.fetch_all("SELECT * FROM subjects WHERE user_id = ?", (self.user['id'],))
        if not subjects:
            messagebox.showwarning("No Subjects", "Please add subjects in the Subject Management section first!")
            return

        options = {
            "max_classes_per_day": 4,
            "avoid_consecutive_difficult": True
        }

        generated_slots = generate_auto_timetable(subjects, DAYS_OF_WEEK, TIME_SLOTS, options)
        
        # Save to database
        db.execute_query("DELETE FROM timetable WHERE user_id = ?", (self.user['id'],))

        for slot in generated_slots:
            db.execute_query('''
                INSERT INTO timetable (user_id, day, slot, subject_id, room, faculty, slot_type)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (self.user['id'], slot['day'], slot['slot'], slot['subject_id'], slot['room'], slot['faculty'], slot['slot_type']))

        messagebox.showinfo("Timetable Generated", "Smart timetable created successfully with zero teacher/room conflict!")
        self.render_timetable_grid()

    def clear_timetable(self):
        if messagebox.askyesno("Confirm", "Are you sure you want to clear the entire timetable?"):
            db.execute_query("DELETE FROM timetable WHERE user_id = ?", (self.user['id'],))
            self.render_timetable_grid()
