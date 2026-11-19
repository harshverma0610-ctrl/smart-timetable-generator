import React from 'react';
import { StudentUser } from '../types';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  CheckSquare,
  FileCheck,
  GraduationCap,
  Timer,
  BarChart3,
  User,
  Settings,
  Code2,
  BookMarked,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'timetable'
  | 'subjects'
  | 'attendance'
  | 'assignments'
  | 'exams'
  | 'study'
  | 'analytics'
  | 'profile'
  | 'settings'
  | 'python_code'
  | 'docs';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: StudentUser;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'timetable', label: 'Timetable', icon: Calendar },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', icon: CheckSquare },
  { id: 'assignments', label: 'Assignments', icon: FileCheck },
  { id: 'exams', label: 'Exams', icon: GraduationCap },
  { id: 'study', label: 'Study planner', icon: Timer },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const resourceItems = [
  { id: 'python_code', label: 'Python desktop app', icon: Code2 },
  { id: 'docs', label: 'Architecture and schema', icon: BookMarked },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => (
  <aside className="app-sidebar flex shrink-0 flex-col justify-between border-r">
    <div className="flex flex-col gap-6">
      <div className="brand-lockup flex items-center gap-3 px-2">
        <div className="brand-mark" aria-hidden="true">ST</div>
        <span className="text-[15px] font-medium tracking-normal text-slate-900 dark:text-white">Smart Timetable</span>
      </div>

      <nav aria-label="Main navigation" className="space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-current={activeTab === id ? 'page' : undefined}
            title={label}
            onClick={() => setActiveTab(id as ActiveTab)}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Icon className="h-4 w-4 shrink-0 text-current" strokeWidth={1.7} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <section className="nav-section border-t border-slate-200 pt-4 dark:border-slate-800" aria-label="Project resources">
        <p className="mb-2 px-3 text-xs text-slate-500">Project resources</p>
        <div className="space-y-1">
          {resourceItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-current={activeTab === id ? 'page' : undefined}
              title={label}
              onClick={() => setActiveTab(id as ActiveTab)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Icon className="h-4 w-4 shrink-0 text-current" strokeWidth={1.7} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>

    <button
      type="button"
      onClick={() => setActiveTab('profile')}
      aria-label="Open student profile"
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-100">
        {user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{user.name}</span>
        <span className="block truncate text-xs text-slate-500">{user.department} · {user.semester} · {user.section}</span>
      </span>
    </button>
  </aside>
);
