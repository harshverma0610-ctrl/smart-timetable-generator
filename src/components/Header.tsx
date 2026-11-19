import React, { useState } from 'react';
import { Bell, Moon, Sun, Code2, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
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
  onOpenDocs,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <header className="app-header sticky top-0 z-30 flex items-center justify-between border-b">
      <div className="workspace-status text-sm text-slate-500 dark:text-slate-400">Student workspace</div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenPythonCode}
          className="secondary-action flex h-9 items-center gap-2 px-2.5 text-sm"
          title="Open Python desktop app source"
          aria-label="Open Python desktop app source"
        >
          <Code2 className="h-4 w-4" strokeWidth={1.7} />
          <span className="hidden xl:inline">Python source</span>
        </button>

        <button
          type="button"
          onClick={onOpenDocs}
          className="secondary-action flex h-9 items-center gap-2 px-2.5 text-sm"
          title="Open architecture and schema"
          aria-label="Open architecture and schema"
        >
          <FileText className="h-4 w-4" strokeWidth={1.7} />
          <span className="hidden xl:inline">Architecture</span>
        </button>

        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="secondary-action grid h-9 w-9 place-items-center"
          aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          title={darkMode ? 'Light theme' : 'Dark theme'}
        >
          {darkMode ? <Sun className="h-4 w-4" strokeWidth={1.7} /> : <Moon className="h-4 w-4" strokeWidth={1.7} />}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifs(!showNotifs)}
            className="secondary-action relative grid h-9 w-9 place-items-center"
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={showNotifs}
          >
            <Bell className="h-4 w-4" strokeWidth={1.7} />
            {unreadCount > 0 && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500" />}
          </button>

          {showNotifs && (
            <section className="surface-card absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border py-1">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-900 dark:text-white">Notifications</span>
                <span className="text-xs text-slate-500">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 divide-y divide-slate-200 overflow-y-auto dark:divide-slate-800">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 px-4 py-3">
                    {notification.category === 'Attendance' ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={1.7} />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.7} />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
                      <span className="mt-1 block text-xs text-slate-500">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">
          <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-slate-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-slate-500">{user.rollNumber}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
