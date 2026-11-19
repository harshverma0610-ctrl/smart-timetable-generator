import customtkinter as ctk
from tkinter import messagebox
from .database import db
from .utils import validate_email

class LoginFrame(ctk.CTkFrame):
    def __init__(self, parent, on_login_success, on_navigate_register):
        super().__init__(parent, corner_radius=15)
        self.on_login_success = on_login_success
        self.on_navigate_register = on_navigate_register

        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(0, weight=1)

        # Container Card
        self.card = ctk.CTkFrame(self, width=400, corner_radius=20, fg_color=("#ffffff", "#1e293b"))
        self.card.place(relx=0.5, rely=0.5, anchor="center")

        # Title
        title_label = ctk.CTkLabel(
            self.card, 
            text="Smart Timetable System", 
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color=("#0f172a", "#f8fafc")
        )
        title_label.pack(padx=30, pady=(30, 5))

        subtitle = ctk.CTkLabel(
            self.card, 
            text="Student Portal Sign In", 
            font=ctk.CTkFont(size=13),
            text_color=("#64748b", "#94a3b8")
        )
        subtitle.pack(padx=30, pady=(0, 20))

        # Username Input
        self.username_entry = ctk.CTkEntry(self.card, placeholder_text="Username or Email", width=320, height=42, corner_radius=10)
        self.username_entry.pack(padx=30, pady=10)

        # Password Input
        self.password_entry = ctk.CTkEntry(self.card, placeholder_text="Password", show="*", width=320, height=42, corner_radius=10)
        self.password_entry.pack(padx=30, pady=10)

        # Remember Me & Forgot Password
        opts_frame = ctk.CTkFrame(self.card, fg_color="transparent")
        opts_frame.pack(fill="x", padx=30, pady=5)

        self.remember_var = ctk.BooleanVar(value=True)
        remember_cb = ctk.CTkCheckBox(opts_frame, text="Remember me", variable=self.remember_var, font=ctk.CTkFont(size=12))
        remember_cb.pack(side="left")

        forgot_btn = ctk.CTkButton(
            opts_frame, 
            text="Forgot Password?", 
            fg_color="transparent", 
            text_color="#3b82f6", 
            hover=False, 
            font=ctk.CTkFont(size=12, underline=True),
            command=self.forgot_password
        )
        forgot_btn.pack(side="right")

        # Login Button
        login_btn = ctk.CTkButton(
            self.card, 
            text="Sign In", 
            width=320, 
            height=45, 
            corner_radius=10, 
            font=ctk.CTkFont(size=15, weight="bold"),
            fg_color="#3b82f6",
            hover_color="#2563eb",
            command=self.attempt_login
        )
        login_btn.pack(padx=30, pady=(20, 15))

        # Register Switch Button
        reg_btn = ctk.CTkButton(
            self.card, 
            text="New Student? Create Account", 
            fg_color="transparent", 
            text_color=("#475569", "#cbd5e1"), 
            hover_color=("#f1f5f9", "#334155"),
            width=320,
            height=35,
            corner_radius=8,
            command=self.on_navigate_register
        )
        reg_btn.pack(padx=30, pady=(0, 25))

    def attempt_login(self):
        username = self.username_entry.get().strip()
        password = self.password_entry.get().strip()

        if not username or not password:
            messagebox.showerror("Error", "Please fill in all credentials.")
            return

        user = db.login_user(username, password)
        if user:
            self.on_login_success(user)
        else:
            messagebox.showerror("Login Failed", "Invalid username/email or password.")

    def forgot_password(self):
        messagebox.showinfo("Password Reset", "Please contact your system administrator or check registered email for verification link.")
