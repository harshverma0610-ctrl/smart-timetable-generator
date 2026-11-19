import React from 'react';
import { User, GraduationCap, Award, Target, BookOpen, Mail, Phone, Code } from 'lucide-react';
import { StudentUser } from '../types';

interface StudentProfileProps {
  user: StudentUser;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ user }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Profile Card Header */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/30 shadow-lg"
        />
        <div className="text-center md:text-left space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            {user.rollNumber}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{user.name}</h1>
          <p className="text-xs text-slate-500">{user.department} • {user.semester} ({user.section})</p>
        </div>

        <div className="md:ml-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Target CGPA</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{user.cgpa.toFixed(2)} / 4.00</p>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            Contact details
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
              <Code className="w-4 h-4 text-slate-400" />
              <span>Username: {user.username}</span>
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-500" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
