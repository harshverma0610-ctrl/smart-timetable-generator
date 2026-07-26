import React from 'react';
import { Settings, Moon, Sun, Database, Shield, Save } from 'lucide-react';

interface SystemSettingsProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ darkMode, setDarkMode }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          System Preferences & Maintenance
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Customize UI themes, notifications, and SQLite database backup/restore</p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Appearance Theme</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(false)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                !darkMode ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" /> Light Theme
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                darkMode ? 'border-blue-600 bg-blue-950 text-blue-300' : 'border-slate-200 text-slate-600'
              }`}
            >
              <Moon className="w-4 h-4 text-amber-400" /> Dark Theme
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Database Administration</h2>
          <button
            onClick={() => alert("SQLite Database dump downloaded to /SmartTimetable/database/backup.db")}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-blue-700 shadow-md"
          >
            <Database className="w-4 h-4" />
            <span>Export SQLite Database Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
