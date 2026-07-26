import React, { useState } from 'react';
import { CheckSquare, AlertTriangle, Check, X as XIcon, Clock, Plus, Award } from 'lucide-react';
import { Subject, AttendanceRecord } from '../types';

interface AttendanceTrackerProps {
  subjects: Subject[];
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  subjects,
  attendance,
  setAttendance
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(subjects[0]?.id || 0);

  const handleMarkAttendance = (subjectId: number, status: "Present" | "Absent" | "Late" | "Medical") => {
    const newRecord: AttendanceRecord = {
      id: Date.now(),
      subjectId,
      date: new Date().toISOString().split('T')[0],
      status
    };
    setAttendance([newRecord, ...attendance]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Attendance Tracker & Predictive Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Automatic 75% minimum threshold warning & predictive class target calculator
        </p>
      </div>

      {/* Subject Attendance Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub) => {
          const records = attendance.filter(a => a.subjectId === sub.id);
          const total = records.length;
          const pCount = records.filter(a => a.status === 'Present' || a.status === 'Medical').length;
          const lCount = records.filter(a => a.status === 'Late').length;
          const effectiveP = pCount + (lCount * 0.5);
          const pct = total > 0 ? Math.round((effectiveP / total) * 100) : 100;

          // Target calculator for 75%
          let classesNeeded = 0;
          if (pct < 75 && total > 0) {
            const req = (0.75 * total - effectiveP) / 0.25;
            classesNeeded = Math.ceil(Math.max(0, req));
          }

          return (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {sub.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-500">{sub.faculty}</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black ${pct >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {pct}%
                  </span>
                  <p className="text-[10px] font-semibold text-slate-400">{effectiveP}/{total} Sessions</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct >= 75 ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Attendance Warning / Safe Prediction */}
              {pct < 75 ? (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>
                    <strong>Low Attendance Warning:</strong> Attend the next <strong>{classesNeeded}</strong> consecutive classes to reach 75%.
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>Safely above 75% minimum threshold.</span>
                </div>
              )}

              {/* Quick Mark Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleMarkAttendance(sub.id, "Present")}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Present</span>
                </button>

                <button
                  onClick={() => handleMarkAttendance(sub.id, "Absent")}
                  className="flex-1 py-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 hover:bg-red-200 text-red-800 dark:text-red-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <XIcon className="w-3.5 h-3.5 text-red-600" />
                  <span>Absent</span>
                </button>

                <button
                  onClick={() => handleMarkAttendance(sub.id, "Late")}
                  className="flex-1 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-800 dark:text-amber-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Late</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
