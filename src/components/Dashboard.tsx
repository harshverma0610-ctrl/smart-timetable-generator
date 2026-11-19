import React from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Activity,
  ArrowUpRight, 
  Play, 
  Plus, 
  BarChart3,
  MapPin,
  UserCheck
} from 'lucide-react';
import { StudentUser, Subject, TimetableSlot, Assignment, AttendanceRecord, Exam } from '../types';
import { ActiveTab } from './Sidebar';

interface DashboardProps {
  user: StudentUser;
  subjects: Subject[];
  timetable: TimetableSlot[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  exams: Exam[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  subjects,
  timetable,
  assignments,
  attendance,
  exams,
  setActiveTab
}) => {
  const todayDate = new Date();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = daysOfWeek[todayDate.getDay()];
  const formattedDate = todayDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  // Today's classes
  const todaysClasses = timetable.filter(
    t => t.day === (currentDayName === "Saturday" || currentDayName === "Sunday" ? "Monday" : currentDayName)
  );

  const nextClass = todaysClasses[0];

  // Pending assignments count
  const pendingAssignments = assignments.filter(a => a.status !== 'Completed');

  // Overall attendance calculation
  const totalClasses = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Medical').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const effectivePresent = presentCount + (lateCount * 0.5);
  const attendancePct = totalClasses > 0 ? Math.round((effectivePresent / totalClasses) * 100) : 100;

  // Next upcoming exam
  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextExam = sortedExams.find((exam) => new Date(exam.date).getTime() >= todayDate.getTime());
  const daysToNextExam = nextExam
    ? Math.ceil((new Date(nextExam.date).getTime() - todayDate.getTime()) / (1000 * 3600 * 24))
    : null;

  // Daily productivity score calculation
  const completedAssignments = assignments.filter(a => a.status === 'Completed').length;
  const productivityScore = Math.min(100, Math.round((attendancePct * 0.5) + (completedAssignments * 10) + 20));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-slate-900 dark:text-white tracking-tight">
            Your day at a glance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {formattedDate} • {user.department} ({user.semester})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.7} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Productivity: {productivityScore}%
            </span>
          </div>

          <button
            onClick={() => setActiveTab('study')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Pomodoro</span>
          </button>
        </div>
      </div>

      {/* Primary Bento Grid Row 1 (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Bento Card 1: Next Class (Col Span 2) */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md">
                Next class
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentDayName === "Saturday" || currentDayName === "Sunday" ? "Monday Schedule" : "Live Session"}
              </span>
            </div>

            {nextClass ? (
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {nextClass.subjectName} ({nextClass.subjectCode})
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {nextClass.slotTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    Venue: {nextClass.classroom}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    Faculty: {nextClass.faculty}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">No More Classes Today</h2>
                <p className="text-xs text-slate-500 mt-1">You've cleared your schedule! Perfect time for self-study or working on pending assignments.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
            <span className="text-xs text-slate-400">
              {todaysClasses.length} total sessions today
            </span>
            <button
              onClick={() => setActiveTab('timetable')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View Full Timetable <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bento Card 2: Attendance Pulse (Col Span 1) */}
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                Attendance
              </span>
              <CheckCircle2 className={`w-4 h-4 ${attendancePct >= 75 ? 'text-emerald-500' : 'text-red-500'}`} />
            </div>

            <div className="mt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{attendancePct}%</span>
                <span className="text-xs text-slate-400 font-medium">Target: 75%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${attendancePct >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                  style={{ width: `${attendancePct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex justify-between items-center">
            <span className="text-xs text-slate-500">
              {attendancePct >= 75 ? 'Above the 75% minimum' : 'Below the 75% minimum'}
            </span>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Details
            </button>
          </div>
        </div>

        {/* Bento Card 3: Featured Dark Bento Box (Exam Countdown) (Col Span 1) */}
        <div className="surface-card col-span-1 rounded-2xl border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">
                Next exam
              </span>
              <Clock className="w-4 h-4 text-slate-500" strokeWidth={1.7} />
            </div>

            <div className="mt-2">
            <p className="text-3xl font-medium tabular-nums tracking-tight text-slate-900 dark:text-white">
              {daysToNextExam === null ? '—' : `${daysToNextExam} days`}
            </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 truncate">
                {nextExam ? nextExam.subjectName : "No upcoming exams"}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 flex justify-between items-center">
            <span className="text-xs text-slate-500 truncate max-w-[120px]">
              {nextExam ? `Date: ${nextExam.date}` : "Add an exam to see the countdown"}
            </span>
            <button
              onClick={() => setActiveTab('exams')}
              className="shrink-0 whitespace-nowrap text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Exam Hub
            </button>
          </div>
        </div>

      </div>

      {/* Secondary Bento Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Bento Card 4: Daily Timetable Schedule Breakdown (Col Span 3) */}
        <div className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Classes today
              </h2>
              <p className="text-xs text-slate-500 font-medium">{currentDayName} · Rooms and class times</p>
            </div>
            <button
              onClick={() => setActiveTab('timetable')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Full Timetable Generator <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todaysClasses.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No classes scheduled for today!</p>
                <p className="text-xs text-slate-500 mt-1">Take this opportunity to review course materials or work on pending assignments.</p>
              </div>
            ) : (
              todaysClasses.map((cls, index) => (
                <div
                  key={cls.id}
                  className={`${index === 0 ? 'next-class-row' : ''} p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="schedule-rule w-1 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: cls.colorLabel }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {cls.slotType}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {cls.subjectName} ({cls.subjectCode})
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {cls.faculty} · {cls.classroom}
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 inline-block">
                      {cls.slotTime}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bento Card 5: Quick Actions & Pending Homework (Col Span 1) */}
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Quick links</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('timetable')}
                className="surface-raised p-3 rounded-xl text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 transition-all text-center border"
              >
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Timetable</span>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className="surface-raised p-3 rounded-xl text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 transition-all text-center border"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Attendance</span>
              </button>

              <button
                onClick={() => setActiveTab('assignments')}
                className="surface-raised p-3 rounded-xl text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 transition-all text-center border"
              >
                <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Add Task</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="surface-raised p-3 rounded-xl text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 transition-all text-center border"
              >
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Analytics</span>
              </button>
            </div>
          </div>

          {/* Pending Tasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Pending tasks</h2>
              <button
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All ({pendingAssignments.length})
              </button>
            </div>

            <div className="space-y-2">
              {pendingAssignments.slice(0, 3).map((a) => (
                <div key={a.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{a.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{a.subjectName}</p>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                      {new Date(`${a.deadline}T23:59:59`).getTime() < todayDate.getTime() ? 'Overdue' : 'Due'} {a.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
