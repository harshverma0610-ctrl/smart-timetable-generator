"""Allow launching the desktop app with ``python -m SmartTimetable``."""

from .main import SmartTimetableApp


def main() -> None:
    app = SmartTimetableApp()
    app.mainloop()


if __name__ == "__main__":
    main()
