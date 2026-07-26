import customtkinter as ctk
from tkinter import messagebox
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

        # Container
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

    def build_main_workspace(self):
        self.clear_container()

        # Workspace with Sidebar + Content
        self.workspace = ctk.CTkFrame(self.container, fg_color="transparent")
        self.workspace.pack(fill="both", expand=True)

        # Sidebar
        self.sidebar = ctk.CTkFrame(self.workspace, width=240, corner_radius=0, fg_color=("#ffffff", "#1e293b"))
        self.sidebar.pack(side="left", fill="y")
        self.sidebar.pack_propagate(False)

        # App Brand Header
        brand = ctk.CTkLabel(self.sidebar, text="⚡ SmartTimetable", font=ctk.CTkFont(size=20, weight="bold"), text_color="#3b82f6")
        brand.pack(padx=20, pady=(25, 20), anchor="w")

        # Nav Buttons
        self.nav_buttons = {}
        nav_items = [
            ("Dashboard", "dashboard", "🏠"),
            ("Timetable", "timetable", "📅"),
            ("Subjects", "subjects", "📚"),
            ("Attendance", "attendance", "📊"),
            ("Assignments", "assignments", "📝"),
            ("Exams", "examplanner", "🎯"),
            ("Study Planner", "studyplanner", "⏱️"),
            ("Notifications", "notifications", "🔔"),
            ("Reports", "reports", "📈"),
            ("Profile", "profile", "👤"),
            ("Settings", "settings", "⚙️"),
        ]

        for text, tab, icon in nav_items:
            btn = ctk.CTkButton(
                self.sidebar,
                text=f"{icon}  {text}",
                fg_color="transparent",
                text_color=("#475569", "#cbd5e1"),
                hover_color=("#f1f5f9", "#334155"),
                anchor="w",
                height=40,
                corner_radius=8,
                font=ctk.CTkFont(size=14),
                command=lambda t=tab: self.switch_tab(t)
            )
            btn.pack(fill="x", padx=12, pady=2)
            self.nav_buttons[tab] = btn

        # Logout
        logout_btn = ctk.CTkButton(
            self.sidebar,
            text="🚪 Sign Out",
            fg_color="#ef4444",
            hover_color="#dc2626",
            height=38,
            corner_radius=8,
            font=ctk.CTkFont(size=13, weight="bold"),
            command=self.logout
        )
        logout_btn.pack(side="bottom", fill="x", padx=12, pady=20)

        # Content Frame
        self.content_area = ctk.CTkFrame(self.workspace, fg_color="transparent")
        self.content_area.pack(side="right", fill="both", expand=True)

        self.switch_tab("dashboard")

    def switch_tab(self, tab):
        for w in self.content_area.winfo_children():
            w.destroy()

        # Update active nav highlight
        for k, btn in self.nav_buttons.items():
            if k == tab:
                btn.configure(fg_color="#3b82f6", text_color="#ffffff")
            else:
                btn.configure(fg_color="transparent", text_color=("#475569", "#cbd5e1"))

        if tab == "dashboard":
            f = DashboardFrame(self.content_area, self.current_user, self.switch_tab)
        elif tab == "timetable":
            f = TimetableFrame(self.content_area, self.current_user)
        elif tab == "subjects":
            f = SubjectsFrame(self.content_area, self.current_user)
        elif tab == "attendance":
            f = AttendanceFrame(self.content_area, self.current_user)
        elif tab == "assignments":
            f = AssignmentsFrame(self.content_area, self.current_user)
        elif tab == "examplanner":
            f = ExamPlannerFrame(self.content_area, self.current_user)
        elif tab == "studyplanner":
            f = StudyPlannerFrame(self.content_area, self.current_user)
        elif tab == "notifications":
            f = NotificationsFrame(self.content_area, self.current_user)
        elif tab == "reports":
            f = ReportsFrame(self.content_area, self.current_user)
        elif tab == "profile":
            f = ProfileFrame(self.content_area, self.current_user)
        elif tab == "settings":
            f = SettingsFrame(self.content_area, self.current_user)

        f.pack(fill="both", expand=True)

    def logout(self):
        if messagebox.askyesno("Confirm Sign Out", "Are you sure you want to sign out?"):
            self.current_user = None
            self.show_login()

    def clear_container(self):
        for widget in self.container.winfo_children():
            widget.destroy()

if __name__ == "__main__":
    app = SmartTimetableApp()
    app.mainloop()
