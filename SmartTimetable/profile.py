import customtkinter as ctk
from .database import db

class ProfileFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="Student Academic Profile", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        card = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=15)
        card.pack(fill="both", expand=True, padx=10, pady=5)

        # Profile details
        avatar = ctk.CTkLabel(card, text="🎓", font=ctk.CTkFont(size=64))
        avatar.pack(pady=(25, 5))

        name = ctk.CTkLabel(card, text=user['name'], font=ctk.CTkFont(size=22, weight="bold"))
        name.pack()

        sub = ctk.CTkLabel(card, text=f"Roll No: {user['roll_number']} | {user['department']} - {user['semester']} ({user['section']})", text_color="#94a3b8")
        sub.pack(pady=(0, 15))

        # Grid details
        details_box = ctk.CTkFrame(card, fg_color=("#f8fafc", "#0f172a"), corner_radius=12)
        details_box.pack(padx=30, pady=10, fill="x")

        items = [
            ("Email Address", user['email']),
            ("Phone Number", user['phone']),
            ("Username", user['username']),
            ("Target CGPA", f"{user['cgpa']:.2f} / 4.00" if user['cgpa'] else "3.85 / 4.00"),
        ]

        for k, v in items:
            row = ctk.CTkFrame(details_box, fg_color="transparent")
            row.pack(fill="x", padx=15, pady=8)
            
            k_lbl = ctk.CTkLabel(row, text=k, font=ctk.CTkFont(size=13, weight="bold"), width=150, anchor="w")
            k_lbl.pack(side="left")

            v_lbl = ctk.CTkLabel(row, text=v, font=ctk.CTkFont(size=13), text_color="#94a3b8")
            v_lbl.pack(side="left")
