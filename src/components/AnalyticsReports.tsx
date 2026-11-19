import React from 'react';
import { BarChart3, Printer, FileSpreadsheet, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Subject, AttendanceRecord, Assignment } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { downloadCsv } from '../utils/downloadCsv';

interface AnalyticsReportsProps {
  subjects: Subject[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({ subjects, attendance, assignments }) => {
  const attendanceData = subjects.map((subject) => {
    const records = attendance.filter((record) => record.subjectId === subject.id);
    const present = records.filter((record) => record.status === 'Present' || record.status === 'Medical').length;
    const late = records.filter((record) => record.status === 'Late').length;
    const percentage = records.length ? Math.round(((present + late * 0.5) / records.length) * 100) : 100;

    return { code: subject.code, name: subject.name, attendance: percentage };
  });

  const studyHours = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 4 },
    { day: 'Wed', hours: 2.5 },
    { day: 'Thu', hours: 5 },
    { day: 'Fri', hours: 3.8 },
    { day: 'Sat', hours: 6 },
    { day: 'Sun', hours: 4.2 },
  ];
  const completedCount = assignments.filter((assignment) => assignment.status === 'Completed').length;
  const pendingCount = assignments.length - completedCount;
  const completionPct = assignments.length ? Math.round((completedCount / assignments.length) * 100) : 0;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Academic attendance report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);
    autoTable(doc, {
      startY: 35,
      head: [['Subject code', 'Subject name', 'Attendance']],
      body: attendanceData.map((row) => [row.code, row.name, `${row.attendance}%`]),
      theme: 'striped',
      headStyles: { fillColor: [49, 95, 150] },
    });
    doc.save('Academic_Attendance_Report.pdf');
  };

  const handleExportCsv = () => {
    downloadCsv(
      'Academic_Attendance.csv',
      ['Subject code', 'Subject name', 'Attendance percentage'],
      attendanceData.map((row) => [row.code, row.name, `${row.attendance}%`]),
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="surface-card flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-medium text-slate-900 dark:text-white">
            <BarChart3 className="h-5 w-5 text-slate-500" strokeWidth={1.7} />
            Academic reports
          </h1>
          <p className="mt-1 text-sm text-slate-500">Attendance by subject and weekly study hours</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExportPDF} className="primary-action flex h-10 items-center gap-2 px-4 text-sm">
            <Printer className="h-4 w-4" strokeWidth={1.7} />
            Export PDF
          </button>
          <button onClick={handleExportCsv} className="secondary-action flex h-10 items-center gap-2 px-4 text-sm">
            <FileSpreadsheet className="h-4 w-4" strokeWidth={1.7} />
            Export CSV
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="surface-card space-y-4 rounded-2xl border p-6 lg:col-span-2">
          <div>
            <h2 className="flex items-center gap-2 text-base font-medium text-slate-900 dark:text-white">
              <BarChart3 className="h-4 w-4 text-slate-500" strokeWidth={1.7} />
              Attendance by subject
            </h2>
            <p className="mt-1 text-sm text-slate-500">Present sessions as a share of classes held</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <XAxis dataKey="code" stroke="#858780" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#858780" fontSize={12} domain={[0, 100]} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(127, 127, 127, 0.08)' }} />
                <Bar dataKey="attendance" name="Attendance" fill="#315f96" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="space-y-4">
          <section className="surface-card space-y-4 rounded-2xl border p-5">
            <div>
              <h2 className="flex items-center gap-2 text-base font-medium text-slate-900 dark:text-white">
                <TrendingUp className="h-4 w-4 text-slate-500" strokeWidth={1.7} />
                Study hours
              </h2>
              <p className="mt-1 text-sm text-slate-500">Hours recorded this week</p>
            </div>
            <div className="space-y-3">
              {studyHours.map(({ day, hours }) => (
                <div key={day} className="grid grid-cols-[32px_1fr_36px] items-center gap-3 text-sm">
                  <span className="text-slate-500">{day}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${(hours / 6) * 100}%` }} />
                  </div>
                  <span className="text-right tabular-nums text-slate-700 dark:text-slate-300">{hours}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card space-y-4 rounded-2xl border p-5">
            <div>
              <h2 className="flex items-center gap-2 text-base font-medium text-slate-900 dark:text-white">
                <CheckCircle2 className="h-4 w-4 text-slate-500" strokeWidth={1.7} />
                Assignment progress
              </h2>
              <p className="mt-1 text-sm text-slate-500">{completedCount} completed · {pendingCount} pending</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-emerald-600" style={{ width: `${completionPct}%` }} />
            </div>
            <p className="text-sm tabular-nums text-slate-700 dark:text-slate-300">{completionPct}% complete</p>
          </section>
        </div>
      </div>
    </div>
  );
};
