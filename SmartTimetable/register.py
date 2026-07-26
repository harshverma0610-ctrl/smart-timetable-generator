import customtkinter as ctk
from tkinter import messagebox
from database import db
from utils import validate_email, validate_phone, validate_roll, check_password_strength

class RegisterFrame(ctk.CTkFrame):
    def __init__(self, parent, on_register_success, on_navigate_login):
        super().__init__(parent, corner_radius=15)
        self.on_register_success = on_register_success
        self.on_navigate_login = on_navigate_login

        # Container Card
        self.card = ctk.CTkFrame(self, width=500, corner_radius=20, fg_color=("#ffffff", "#1e293b"))
        self.card.place(relx=0.5, rely=0.5, anchor="center")

        title_label = ctk.CTkLabel(
            self.card, 
            text="Student Registration", 
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color=("#0f172a", "#f8fafc")
        )
        title_label.pack(padx=30, pady=(25, 5))

        subtitle = ctk.CTkLabel(
            self.card, 
            text="Create your productivity account", 
            font=ctk.CTkFont(size=12),
            text_color=("#64748b", "#94a3b8")
        )
        subtitle.pack(padx=30, pady=(0, 15))

        # Scrollable form container
        self.form = ctk.CTkScrollableFrame(self.card, width=440, height=380, fg_color="transparent")
        self.form.pack(padx=20, pady=5)

        # Fields
        self.entries = {}
        fields = [
            ("Student Name", "name", "John Doe"),
            ("Roll Number", "roll_number", "2024-CS-101"),
            ("Department", "department", "Computer Science"),
            ("Semester", "semester", "Semester 5"),
            ("Section", "section", "Section A"),
            ("Email Address", "email", "student@university.edu"),
            ("Phone Number", "phone", "+1234567890"),
            ("Username", "username", "johndoe"),
            ("Password", "password", "******"),
            ("Confirm Password", "confirm_password", "******"),
        ]

        for label_text, key, placeholder in fields:
            lbl = ctk.CTkLabel(self.form, text=label_text, font=ctk.CTkFont(size=12, weight="bold"))
            lbl.pack(anchor="w", pady=(8, 2))
            
            show_char = "*" if "password" in key else ""
            entry = ctk.CTkEntry(self.form, placeholder_text=placeholder, show=show_char, height=38, corner_radius=8)
            entry.pack(fill="x", pady=(0, 5))
            self.entries[key] = entry

        # Submit button
        sub_btn = ctk.CTkButton(
            self.card, 
            text="Complete Registration", 
            height=42, 
            corner_radius=10, 
            font=ctk.CTkFont(size=14, weight="bold"),
            fg_color="#22c55e",
            hover_color="#16a34a",
            command=self.attempt_registration
        )
        sub_btn.pack(padx=30, pady=(15, 10), fill="x")

        back_btn = ctk.CTkButton(
            self.card, 
            text="Already registered? Log in", 
            fg_color="transparent", 
            text_color="#3b82f6", 
            command=self.on_navigate_login
        )
        back_btn.pack(padx=30, pady=(0, 20))

    def attempt_registration(self):
        data = {k: v.get().strip() for k, v in self.entries.items()}

        # Validations
        if any(not v for v in data.values()):
            messagebox.showerror("Validation Error", "All fields are required.")
            return

        if not validate_email(data['email']):
            messagebox.showerror("Validation Error", "Invalid email format.")
            return

        if not validate_phone(data['phone']):
            messagebox.showerror("Validation Error", "Invalid phone number.")
            return

        if data['password'] != data['confirm_password']:
            messagebox.showerror("Validation Error", "Passwords do not match.")
            return

        valid_pwd, msg = check_password_strength(data['password'])
        if not valid_pwd:
            messagebox.showerror("Password Weak", msg)
            return

        user_id = db.register_user(
            name=data['name'],
            roll_number=data['roll_number'],
            department=data['department'],
            semester=data['semester'],
            section=data['section'],
            email=data['email'],
            phone=data['phone'],
            username=data['username'],
            password=data['password']
        )

        if user_id:
            messagebox.showinfo("Success", "Account created successfully! Please sign in.")
            self.on_navigate_login()
        else:
            messagebox.showerror("Registration Error", "Username, Roll Number, or Email already registered.")
