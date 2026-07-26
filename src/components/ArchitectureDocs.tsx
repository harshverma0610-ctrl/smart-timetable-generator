import React, { useState } from 'react';
import { BookMarked, Database, GitBranch, Layers, CheckCircle2 } from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"er" | "flowchart" | "schema">("er");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            System Architecture & ER Diagram Documentation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive documentation for university major project evaluation</p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("er")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "er" ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ER Diagram
          </button>
          <button
            onClick={() => setActiveTab("flowchart")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "flowchart" ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            System Flowchart
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "schema" ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Database Schema
          </button>
        </div>
      </div>

      {activeTab === "er" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Entity-Relationship Diagram (ERD)</h2>
          <div className="p-6 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
            <pre className="leading-relaxed">{`
[ USERS ] 1 ──── N [ SUBJECTS ]
  │                     │
  │ 1                   │ 1
  │                     │
  ▼ N                   ▼ N
[ ATTENDANCE ]     [ TIMETABLE ]
  │
  └───────────────── N [ ASSIGNMENTS ]
            `}</pre>
          </div>
        </div>
      )}

      {activeTab === "flowchart" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">System Execution Flowchart</h2>
          <div className="p-6 rounded-xl bg-slate-950 font-mono text-xs text-blue-400 overflow-x-auto border border-slate-800">
            <pre className="leading-relaxed">{`
[ START ] ──> [ Launch App ] ──> [ User Sign In / Reg ]
                                         │
                                         ▼
                      [ Load CustomTkinter Dashboard ]
                                         │
   ┌───────────────────┬─────────────────┼───────────────────┐
   ▼                   ▼                 ▼                   ▼
[ Auto Generator ] [ Attendance ]  [ Assignments ]    [ Pomodoro Timer ]
   │                   │                 │                   │
[ Constraint Solver ] [ Predictor % ]  [ Countdown ]   [ Focus Session ]
   │                   │                 │                   │
   └───────────────────┴─────────────────┼───────────────────┘
                                         │
                                         ▼
                            [ Export PDF / Excel / DB ]
            `}</pre>
          </div>
        </div>
      )}

      {activeTab === "schema" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">SQLite Database Table Schemas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">TABLE: users</h3>
              <p className="text-slate-600 dark:text-slate-400">id (PK), name, roll_number (UNIQUE), department, semester, section, email, phone, username, password_hash, cgpa</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">TABLE: subjects</h3>
              <p className="text-slate-600 dark:text-slate-400">id (PK), user_id (FK), code, name, faculty, credits, classroom, color_label, difficulty</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
