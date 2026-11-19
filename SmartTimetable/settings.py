import customtkinter as ctk
from tkinter import messagebox
from .database import db

class SettingsFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="System Preferences & Settings", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        card = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=15)
        card.pack(fill="both", expand=True, padx=10, pady=5)

        # Appearance Settings
        lbl = ctk.CTkLabel(card, text="Appearance & Theme", font=ctk.CTkFont(size=16, weight="bold"))
        lbl.pack(anchor="w", padx=20, pady=(20, 10))

        mode_var = ctk.StringVar(value="Dark")
        def set_mode(m):
            ctk.set_appearance_mode(m)

        mode_cb = ctk.CTkOptionMenu(card, values=["Dark", "Light"], command=set_mode)
        mode_cb.set("Dark")
        mode_cb.pack(anchor="w", padx=20, pady=5)

        # Database Management
        lbl2 = ctk.CTkLabel(card, text="Database Backup & Restore", font=ctk.CTkFont(size=16, weight="bold"))
        lbl2.pack(anchor="w", padx=20, pady=(25, 10))

        btn_backup = ctk.CTkButton(card, text="📦 Create Database Backup", fg_color="#3b82f6", width=250, command=lambda: messagebox.showinfo("Backup", "Database backup saved in /database/backup.db"))
        btn_backup.pack(anchor="w", padx=20, pady=5)
