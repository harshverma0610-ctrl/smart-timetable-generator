import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Code2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { StudentUser, SystemNotification } from '../types';

interface HeaderProps {
  user: StudentUser;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  notifications: SystemNotification[];
  onOpenPythonCode: () => void;
  onOpenDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  darkMode,
  setDarkMode,
  notifications,
  onOpenPythonCode,
  onOpenDocs
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Python 3.12 + CustomTkinter Ready</span>
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Python Source Code Inspector Button */}
        <button
          onClick={onOpenPythonCode}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-sm"
          title="Inspect and Download Desktop Python Source Files"
        >
          <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline">Python Source Code</span>
        </button>

        {/* Architecture & Docs Button */}
        <button
          onClick={onOpenDocs}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all shadow-sm"
          title="View Flowchart, ER Diagram & Schema"
        >
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden md:inline">ER Diagram & Docs</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-xs uppercase text-slate-800 dark:text-slate-200 tracking-wider">System Alerts</span>
                <span className="text-[10px] font-semibold text-slate-400">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      {n.category === 'Attendance' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Summary */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
            <p className="text-[10px] text-slate-400 font-medium">{user.rollNumber}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
