import React from 'react';
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
  BookMarked
} from 'lucide-react';

export type ActiveTab = 
  | "dashboard" 
  | "timetable" 
  | "subjects" 
  | "attendance" 
  | "assignments" 
  | "exams" 
  | "study" 
  | "analytics" 
  | "profile" 
  | "settings"
  | "python_code"
  | "docs";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "timetable", label: "Timetable", icon: Calendar },
    { id: "subjects", label: "Subject Manager", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: CheckSquare },
    { id: "assignments", label: "Assignments", icon: FileCheck },
    { id: "exams", label: "Exams", icon: GraduationCap },
    { id: "study", label: "Study & Focus", icon: Timer },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const devItems = [
    { id: "python_code", label: "Python Desktop App", icon: Code2 },
    { id: "docs", label: "Architecture & ER", icon: BookMarked },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between shrink-0 transition-colors border-r border-slate-800">
      <div className="p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 text-white mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-md shadow-blue-500/20">
            S
          </div>
          <span className="font-bold tracking-tight text-lg italic text-white">SmartTimetable</span>
        </div>

        {/* Primary Nav */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Developer / Project Docs Section */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <p className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Project Source Code</p>
          <div className="space-y-1">
            {devItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-6 pt-0">
        <div 
          onClick={() => setActiveTab('profile')}
          className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 cursor-pointer hover:border-slate-600 transition-colors"
        >
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 italic">Student Profile</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-500/30 shrink-0">
              AM
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Alex Murphy</p>
              <p className="text-[10px] text-slate-400 truncate">CS • Sem 5 (Sec A)</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
