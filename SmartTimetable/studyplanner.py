import customtkinter as ctk
import time
from tkinter import messagebox
from database import db

class StudyPlannerFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="Smart Study Planner & Focus Pomodoro Timer", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        # Dual Section: Pomodoro Timer & Study Schedule
        main_box = ctk.CTkFrame(self, fg_color="transparent")
        main_box.pack(fill="both", expand=True, padx=10, pady=5)
        main_box.grid_columnconfigure((0, 1), weight=1)
        main_box.grid_rowconfigure(0, weight=1)

        # Left: Pomodoro Timer Card
        pomo_card = ctk.CTkFrame(main_box, fg_color=("#ffffff", "#1e293b"), corner_radius=15)
        pomo_card.grid(row=0, column=0, sticky="nsew", padx=(0, 5))

        p_lbl = ctk.CTkLabel(pomo_card, text="⏱️ Pomodoro Focus Timer", font=ctk.CTkFont(size=18, weight="bold"))
        p_lbl.pack(padx=20, pady=20)

        self.timer_label = ctk.CTkLabel(pomo_card, text="25:00", font=ctk.CTkFont(size=56, weight="bold"), text_color="#3b82f6")
        self.timer_label.pack(pady=20)

        self.is_running = False
        self.time_seconds = 25 * 60

        ctrl_frame = ctk.CTkFrame(pomo_card, fg_color="transparent")
        ctrl_frame.pack(pady=15)

        start_btn = ctk.CTkButton(ctrl_frame, text="Start Focus", fg_color="#22c55e", hover_color="#16a34a", width=120, command=self.start_timer)
        start_btn.pack(side="left", padx=5)

        pause_btn = ctk.CTkButton(ctrl_frame, text="Pause", fg_color="#f59e0b", hover_color="#d97706", width=100, command=self.pause_timer)
        pause_btn.pack(side="left", padx=5)

        reset_btn = ctk.CTkButton(ctrl_frame, text="Reset", fg_color="#ef4444", hover_color="#dc2626", width=100, command=self.reset_timer)
        reset_btn.pack(side="left", padx=5)

        # Right: Study Plan Auto-Generator
        plan_card = ctk.CTkFrame(main_box, fg_color=("#ffffff", "#1e293b"), corner_radius=15)
        plan_card.grid(row=0, column=1, sticky="nsew", padx=(5, 0))

        pl_lbl = ctk.CTkLabel(plan_card, text="🧠 AI Study Schedule Optimizer", font=ctk.CTkFont(size=18, weight="bold"))
        pl_lbl.pack(padx=20, pady=20)

        sub_lbl = ctk.CTkLabel(plan_card, text="Prioritize weak subjects and upcoming exams automatically.", text_color="#94a3b8")
        sub_lbl.pack(padx=20)

        gen_btn = ctk.CTkButton(
            plan_card,
            text="Generate Today's Study Goals",
            fg_color="#8b5cf6",
            hover_color="#7c3aed",
            height=42,
            font=ctk.CTkFont(size=14, weight="bold"),
            command=self.generate_study_goals
        )
        gen_btn.pack(padx=20, pady=20, fill="x")

        self.goals_scroll = ctk.CTkScrollableFrame(plan_card, fg_color="transparent")
        self.goals_scroll.pack(fill="both", expand=True, padx=15, pady=(0, 15))

    def start_timer(self):
        if not self.is_running:
            self.is_running = True
            self.countdown()

    def pause_timer(self):
        self.is_running = False

    def reset_timer(self):
        self.is_running = False
        self.time_seconds = 25 * 60
        self.timer_label.configure(text="25:00")

    def countdown(self):
        if self.is_running and self.time_seconds > 0:
            self.time_seconds -= 1
            mins = self.time_seconds // 60
            secs = self.time_seconds % 60
            self.timer_label.configure(text=f"{mins:02d}:{secs:02d}")
            self.after(1000, self.countdown)
        elif self.time_seconds == 0:
            self.is_running = False
            messagebox.showinfo("Pomodoro Completed", "Great job! Time for a 5-minute break!")

    def generate_study_goals(self):
        for w in self.goals_scroll.winfo_children():
            w.destroy()

        subjects = db.fetch_all("SELECT * FROM subjects WHERE user_id = ?", (self.user['id'],))
        if not subjects:
            lbl = ctk.CTkLabel(self.goals_scroll, text="Add subjects first to generate study goals.", text_color="#64748b")
            lbl.pack(pady=20)
            return

        # Sort hard subjects first
        sorted_subs = sorted(subjects, key=lambda s: 0 if s.get('difficulty') == 'Hard' else 1)

        for idx, sub in enumerate(sorted_subs, 1):
            goal_item = ctk.CTkFrame(self.goals_scroll, fg_color=("#f8fafc", "#0f172a"), corner_radius=10)
            goal_item.pack(fill="x", pady=5)

            t_lbl = ctk.CTkLabel(goal_item, text=f"Goal #{idx}: Review {sub['name']}", font=ctk.CTkFont(size=14, weight="bold"), text_color=sub['color_label'])
            t_lbl.pack(anchor="w", padx=12, pady=(8, 2))

            m_lbl = ctk.CTkLabel(goal_item, text=f"Recommended Duration: 45 Mins | Difficulty: {sub['difficulty']}", text_color="#94a3b8")
            m_lbl.pack(anchor="w", padx=12, pady=(0, 8))
