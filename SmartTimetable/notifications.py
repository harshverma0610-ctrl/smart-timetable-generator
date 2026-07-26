import customtkinter as ctk
from database import db

class NotificationsFrame(ctk.CTkFrame):
    def __init__(self, parent, user):
        super().__init__(parent, fg_color="transparent")
        self.user = user

        header = ctk.CTkFrame(self, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
        header.pack(fill="x", padx=10, pady=10)

        title = ctk.CTkLabel(header, text="Desktop Notifications & Reminders Center", font=ctk.CTkFont(size=20, weight="bold"))
        title.pack(side="left", padx=15, pady=15)

        self.scroll = ctk.CTkScrollableFrame(self, fg_color="transparent")
        self.scroll.pack(fill="both", expand=True, padx=10, pady=5)

        self.load_notifications()

    def load_notifications(self):
        for w in self.scroll.winfo_children():
            w.destroy()

        notifs = db.fetch_all("SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC", (self.user['id'],))

        if not notifs:
            lbl = ctk.CTkLabel(self.scroll, text="🔔 All clear! No pending notifications.", text_color="#64748b")
            lbl.pack(pady=40)
            return

        for n in notifs:
            card = ctk.CTkFrame(self.scroll, fg_color=("#ffffff", "#1e293b"), corner_radius=12)
            card.pack(fill="x", pady=5)

            title_lbl = ctk.CTkLabel(card, text=n['title'], font=ctk.CTkFont(size=15, weight="bold"))
            title_lbl.pack(anchor="w", padx=15, pady=(10, 2))

            msg_lbl = ctk.CTkLabel(card, text=n['message'], text_color="#94a3b8")
            msg_lbl.pack(anchor="w", padx=15, pady=(0, 10))
