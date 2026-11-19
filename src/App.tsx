import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import {
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_ATTENDANCE,
  INITIAL_NOTIFICATIONS,
  generateInitialTimetable,
} from './data/mockDatabase';

const TimetableGenerator = lazy(() => import('./components/TimetableGenerator').then(({ TimetableGenerator }) => ({ default: TimetableGenerator })));
const SubjectManager = lazy(() => import('./components/SubjectManager').then(({ SubjectManager }) => ({ default: SubjectManager })));
const AttendanceTracker = lazy(() => import('./components/AttendanceTracker').then(({ AttendanceTracker }) => ({ default: AttendanceTracker })));
const AssignmentTracker = lazy(() => import('./components/AssignmentTracker').then(({ AssignmentTracker }) => ({ default: AssignmentTracker })));
const ExamPlanner = lazy(() => import('./components/ExamPlanner').then(({ ExamPlanner }) => ({ default: ExamPlanner })));
const StudyPlanner = lazy(() => import('./components/StudyPlanner').then(({ StudyPlanner }) => ({ default: StudyPlanner })));
const AnalyticsReports = lazy(() => import('./components/AnalyticsReports').then(({ AnalyticsReports }) => ({ default: AnalyticsReports })));
const StudentProfile = lazy(() => import('./components/StudentProfile').then(({ StudentProfile }) => ({ default: StudentProfile })));
const SystemSettings = lazy(() => import('./components/SystemSettings').then(({ SystemSettings }) => ({ default: SystemSettings })));
const PythonCodeExplorer = lazy(() => import('./components/PythonCodeExplorer').then(({ PythonCodeExplorer }) => ({ default: PythonCodeExplorer })));
const ArchitectureDocs = lazy(() => import('./components/ArchitectureDocs').then(({ ArchitectureDocs }) => ({ default: ArchitectureDocs })));

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
    <div className="app-shell flex flex-col font-sans text-slate-900 antialiased dark:text-slate-100">
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
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

        {/* Dynamic Content Viewport */}
        <main className="app-main flex-1 overflow-y-auto">
          <Suspense fallback={<div className="page-loading" role="status">Loading view</div>}>
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
              <SubjectManager subjects={subjects} setSubjects={setSubjects} />
            )}

            {activeTab === "attendance" && (
              <AttendanceTracker subjects={subjects} attendance={attendance} setAttendance={setAttendance} />
            )}

            {activeTab === "assignments" && (
              <AssignmentTracker subjects={subjects} assignments={assignments} setAssignments={setAssignments} />
            )}

            {activeTab === "exams" && (
              <ExamPlanner subjects={subjects} exams={exams} setExams={setExams} />
            )}

            {activeTab === "study" && (
              <StudyPlanner subjects={subjects} />
            )}

            {activeTab === "analytics" && (
              <AnalyticsReports subjects={subjects} attendance={attendance} assignments={assignments} />
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
          </Suspense>
        </main>
      </div>
    </div>
  );
}
