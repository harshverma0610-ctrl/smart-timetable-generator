import customtkinter as ctk
from datetime import datetime
from database import db
from utils import calculate_attendance_stats

class DashboardFrame(ctk.CTkFrame):
    def __init__(self, parent, user, navigate_tab_cb):
        super().__init__(parent, fg_color="transparent")
        self.user = user
        self.navigate_tab = navigate_tab_cb

        # Top Greeting Header
        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=15)
        header.pack(fill="x", padx=10, pady=10)

        now = datetime.now()
        hour = now.hour
        greeting = "Good Morning" if hour < 12 else "Good Afternoon" if hour < 18 else "Good Evening"

        title_lbl = ctk.CTkLabel(
            header, 
            text=f"{greeting}, {user['name']} 👋", 
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color=("#0f172a", "#f8fafc")
        )
        title_lbl.pack(anchor="w", padx=20, pady=(15, 2))

        sub_lbl = ctk.CTkLabel(
            header, 
            text=f"{user['department']} | {user['semester']} - {user['section']} | {now.strftime('%A, %B %d, %Y')}", 
            font=ctk.CTkFont(size=13),
            text_color=("#64748b", "#94a3b8")
        )
        sub_lbl.pack(anchor="w", padx=20, pady=(0, 15))

        # Metric Summary Cards Grid
        cards_frame = ctk.CTkFrame(self, fg_color="transparent")
        cards_frame.pack(fill="x", padx=10, pady=5)
        cards_frame.grid_columnconfigure((0, 1, 2, 3), weight=1)

        self.render_stat_card(cards_frame, 0, "Today's Classes", "4 Lectures", "📅", "#3b82f6")
        
        # Calculate real attendance
        att_records = db.fetch_all("SELECT * FROM attendance WHERE user_id = ?", (user['id'],))
        stats = calculate_attendance_stats(att_records)
        att_color = "#22c55e" if stats['percentage'] >= 75 else "#ef4444"
        self.render_stat_card(cards_frame, 1, "Overall Attendance", f"{stats['percentage']}%", "📊", att_color)

        # Assignments pending
        pending_assign = db.fetch_one("SELECT COUNT(*) as cnt FROM assignments WHERE user_id = ? AND status != 'Completed'", (user['id'],))
        assign_cnt = pending_assign['cnt'] if pending_assign else 0
        self.render_stat_card(cards_frame, 2, "Pending Assignments", f"{assign_cnt} Due", "📝", "#f59e0b")

        # Next Exam Countdown
        next_exam = db.fetch_one("SELECT * FROM exams WHERE user_id = ? ORDER BY date ASC LIMIT 1", (user['id'],))
        exam_text = next_exam['date'] if next_exam else "No Exams"
        self.render_stat_card(cards_frame, 3, "Next Exam", exam_text, "🎯", "#8b5cf6")

        # Main Content Dual Panel
        main_panel = ctk.CTkFrame(self, fg_color="transparent")
        main_panel.pack(fill="both", expand=True, padx=10, pady=10)
        main_panel.grid_columnconfigure(0, weight=3)
        main_panel.grid_columnconfigure(1, weight=2)
        main_panel.grid_rowconfigure(0, weight=1)

        # Left Panel: Today's Schedule & Quick Actions
        left_box = ctk.CTkFrame(main_panel, fg_color=("#ffffff", "#1e293b"), corner_radius=15)
        left_box.grid(row=0, column=0, sticky="nsew", padx=(0, 5))

        lbl = ctk.CTkLabel(left_box, text="Today's Timetable Schedule", font=ctk.CTkFont(size=16, weight="bold"))
        lbl.pack(anchor="w", padx=15, pady=15)

        today_day = now.strftime('%A')
        today_classes = db.fetch_all('''
            SELECT t.*, s.name as sub_name, s.color_label 
            FROM timetable t 
            JOIN subjects s ON t.subject_id = s.id 
            WHERE t.user_id = ? AND t.day = ?
            ORDER BY t.slot ASC
        ''', (user['id'], today_day))

        schedule_scroll = ctk.CTkScrollableFrame(left_box, fg_color="transparent")
        schedule_scroll.pack(fill="both", expand=True, padx=15, pady=(0, 15))

        if not today_classes:
            no_cls = ctk.CTkLabel(schedule_scroll, text="🎉 No classes scheduled for today! Great time to study or review.", text_color="#64748b")
            no_cls.pack(pady=30)
        else:
            for cls in today_classes:
                item = ctk.CTkFrame(schedule_scroll, fg_color=("#f8fafc", "#0f172a"), corner_radius=10)
                item.pack(fill="x", pady=5)
                
                c_lbl = ctk.CTkLabel(item, text=cls['sub_name'], font=ctk.CTkFont(size=14, weight="bold"), text_color=cls['color_label'])
                c_lbl.pack(anchor="w", padx=15, pady=(10, 2))

                details = ctk.CTkLabel(item, text=f"⏰ {cls['slot']}  |  🏫 Room {cls['room']}  |  👨‍🏫 {cls['faculty']}", text_color="#94a3b8")
                details.pack(anchor="w", padx=15, pady=(0, 10))

        # Right Panel: Productivity & Quick Actions
        right_box = ctk.CTkFrame(main_panel, fg_color=("#ffffff", "#1e293b"), corner_radius=15)
        right_box.grid(row=0, column=1, sticky="nsew", padx=(5, 0))

        lbl2 = ctk.CTkLabel(right_box, text="Quick Productivity Actions", font=ctk.CTkFont(size=16, weight="bold"))
        lbl2.pack(anchor="w", padx=15, pady=15)

        actions = [
            ("⚡ Auto-Generate Timetable", "timetable", "#3b82f6"),
            ("📌 Mark Attendance", "attendance", "#22c55e"),
            ("➕ Add Assignment", "assignments", "#f59e0b"),
            ("⏱️ Start Pomodoro Timer", "studyplanner", "#8b5cf6"),
            ("📊 View Reports & Analytics", "reports", "#ec4899"),
        ]

        for title, tab, color in actions:
            btn = ctk.CTkButton(
                right_box,
                text=title,
                fg_color=color,
                hover_color="#1d4ed8",
                height=42,
                corner_radius=10,
                font=ctk.CTkFont(size=13, weight="bold"),
                command=lambda t=tab: self.navigate_tab(t)
            )
            btn.pack(fill="x", padx=15, pady=6)

    def render_stat_card(self, parent, col, title, value, icon, color):
        card = ctk.CTkFrame(parent, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        card.grid(row=0, column=col, sticky="ew", padx=5)

        top_f = ctk.CTkFrame(card, fg_color="transparent")
        top_f.pack(fill="x", padx=12, pady=(12, 0))

        ic_lbl = ctk.CTkLabel(top_f, text=icon, font=ctk.CTkFont(size=20))
        ic_lbl.pack(side="left")

        val_lbl = ctk.CTkLabel(card, text=value, font=ctk.CTkFont(size=20, weight="bold"), text_color=color)
        val_lbl.pack(anchor="w", padx=12, pady=(5, 0))

        title_lbl = ctk.CTkLabel(card, text=title, font=ctk.CTkFont(size=12), text_color=("#64748b", "#94a3b8"))
        title_lbl.pack(anchor="w", padx=12, pady=(0, 12))
