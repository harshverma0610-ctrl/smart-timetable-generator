#!/usr/bin/env python3
import os
import sys

# Add SmartTimetable package directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "SmartTimetable"))

from main import SmartTimetableApp

if __name__ == "__main__":
    app = SmartTimetableApp()
    app.mainloop()
