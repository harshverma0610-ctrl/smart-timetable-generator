import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TimetableGenerator } from './components/TimetableGenerator';
import { SubjectManager } from './components/SubjectManager';
import { AttendanceTracker } from './components/AttendanceTracker';
import { AssignmentTracker } from './components/AssignmentTracker';
import { ExamPlanner } from './components/ExamPlanner';
import { StudyPlanner } from './components/StudyPlanner';
import { AnalyticsReports } from './components/AnalyticsReports';
import { StudentProfile } from './components/StudentProfile';
import { SystemSettings } from './components/SystemSettings';
import { PythonCodeExplorer } from './components/PythonCodeExplorer';
import { ArchitectureDocs } from './components/ArchitectureDocs';

import { 
  INITIAL_USER, 
  INITIAL_SUBJECTS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_EXAMS, 
  INITIAL_ATTENDANCE, 
  INITIAL_NOTIFICATIONS,
  generateInitialTimetable 
} from './data/mockDatabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [darkMode, setDarkMode] = useState(true);

  // App persistent state
  const [user, setUser] = useState(INITIAL_USER);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [timetable, setTimetable] = useState(() => generateInitialTimetable(INITIAL_SUBJECTS));

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Header
        user={user}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={notifications}
        onOpenPythonCode={() => setActiveTab("python_code")}
        onOpenDocs={() => setActiveTab("docs")}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#F1F5F9] dark:bg-slate-950">
          {activeTab === "dashboard" && (
            <Dashboard
              user={user}
              subjects={subjects}
              timetable={timetable}
              assignments={assignments}
              attendance={attendance}
              exams={exams}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "timetable" && (
            <TimetableGenerator
              subjects={subjects}
              timetable={timetable}
              setTimetable={setTimetable}
            />
          )}

          {activeTab === "subjects" && (
            <SubjectManager
              subjects={subjects}
              setSubjects={setSubjects}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceTracker
              subjects={subjects}
              attendance={attendance}
              setAttendance={setAttendance}
            />
          )}

          {activeTab === "assignments" && (
            <AssignmentTracker
              subjects={subjects}
              assignments={assignments}
              setAssignments={setAssignments}
            />
          )}

          {activeTab === "exams" && (
            <ExamPlanner
              subjects={subjects}
              exams={exams}
              setExams={setExams}
            />
          )}

          {activeTab === "study" && (
            <StudyPlanner subjects={subjects} />
          )}

          {activeTab === "analytics" && (
            <AnalyticsReports
              subjects={subjects}
              attendance={attendance}
              assignments={assignments}
            />
          )}

          {activeTab === "profile" && (
            <StudentProfile user={user} />
          )}

          {activeTab === "settings" && (
            <SystemSettings darkMode={darkMode} setDarkMode={setDarkMode} />
          )}

          {activeTab === "python_code" && (
            <PythonCodeExplorer />
          )}

          {activeTab === "docs" && (
            <ArchitectureDocs />
          )}
        </main>
      </div>
    </div>
  );
}
