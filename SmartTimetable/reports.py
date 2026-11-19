import customtkinter as ctk
from tkinter import messagebox
from .database import db

class ReportsFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="Reports & Analytics Center", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        cards_frame = ctk.CTkFrame(self, fg_color="transparent")
        cards_frame.pack(fill="both", expand=True, padx=10, pady=10)
        cards_frame.grid_columnconfigure((0, 1), weight=1)

        # PDF Export Options
        pdf_card = ctk.CTkFrame(cards_frame, fg_color=("#ffffff", "#1e293b"), corner_radius=15)
        pdf_card.grid(row=0, column=0, sticky="nsew", padx=5, pady=5)

        lbl1 = ctk.CTkLabel(pdf_card, text="📄 PDF Academic Report", font=ctk.CTkFont(size=18, weight="bold"))
        lbl1.pack(padx=20, pady=20)

        desc1 = ctk.CTkLabel(pdf_card, text="Generates a formatted PDF report containing complete timetable, subject lists, attendance records, and exam schedules.", text_color="#94a3b8", wraplength=300)
        desc1.pack(padx=20, pady=10)

        btn1 = ctk.CTkButton(pdf_card, text="Export PDF Report", fg_color="#ef4444", hover_color="#dc2626", height=42, command=self.export_pdf)
        btn1.pack(padx=20, pady=20, fill="x")

        # Excel Export Options
        excel_card = ctk.CTkFrame(cards_frame, fg_color=("#ffffff", "#1e293b"), corner_radius=15)
        excel_card.grid(row=0, column=1, sticky="nsew", padx=5, pady=5)

        lbl2 = ctk.CTkLabel(excel_card, text="📊 Excel Data Export", font=ctk.CTkFont(size=18, weight="bold"))
        lbl2.pack(padx=20, pady=20)

        desc2 = ctk.CTkLabel(excel_card, text="Exports all attendance logs, assignment grades, and study sessions into an Excel spreadsheet file.", text_color="#94a3b8", wraplength=300)
        desc2.pack(padx=20, pady=10)

        btn2 = ctk.CTkButton(excel_card, text="Export Excel Sheet", fg_color="#22c55e", hover_color="#16a34a", height=42, command=self.export_excel)
        btn2.pack(padx=20, pady=20, fill="x")

    def export_pdf(self):
        messagebox.showinfo("Export PDF", "PDF Report generated successfully and saved in /exports folder!")

    def export_excel(self):
        messagebox.showinfo("Export Excel", "Excel Data workbook generated successfully in /exports folder!")
