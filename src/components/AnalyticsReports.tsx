import React from 'react';
import { 
  BarChart3, 
  Printer, 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  PieChart as PieIcon, 
  BookOpen 
} from 'lucide-react';
import { Subject, AttendanceRecord, Assignment } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface AnalyticsReportsProps {
  subjects: Subject[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  subjects,
  attendance,
  assignments
}) => {
  // Chart Data 1: Subject Attendance
  const attendanceData = subjects.map(sub => {
    const recs = attendance.filter(a => a.subjectId === sub.id);
    const total = recs.length;
    const pCount = recs.filter(a => a.status === 'Present' || a.status === 'Medical').length;
    const lCount = recs.filter(a => a.status === 'Late').length;
    const effP = pCount + (lCount * 0.5);
    const pct = total > 0 ? Math.round((effP / total) * 100) : 100;

    return {
      name: sub.code,
      fullName: sub.name,
      AttendancePct: pct
    };
  });

  // Chart Data 2: Weekly Study Hours
  const studyTrendData = [
    { day: 'Mon', Hours: 3.5 },
    { day: 'Tue', Hours: 4.0 },
    { day: 'Wed', Hours: 2.5 },
    { day: 'Thu', Hours: 5.0 },
    { day: 'Fri', Hours: 3.8 },
    { day: 'Sat', Hours: 6.0 },
    { day: 'Sun', Hours: 4.2 },
  ];

  // Chart Data 3: Assignment Status Breakdown
  const pendingCount = assignments.filter(a => a.status !== 'Completed').length;
  const completedCount = assignments.filter(a => a.status === 'Completed').length;
  const assignmentPieData = [
    { name: 'Completed Tasks', value: completedCount, color: '#22c55e' },
    { name: 'Pending Homework', value: pendingCount, color: '#f59e0b' }
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Smart Timetable & Academic Analytics Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [['Subject Code', 'Subject Name', 'Attendance %']],
      body: attendanceData.map(d => [d.name, d.fullName, `${d.AttendancePct}%`]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save('Academic_Analytics_Report.pdf');
  };

  const handleExportExcel = () => {
    const sheetData = attendanceData.map(d => ({
      SubjectCode: d.name,
      SubjectName: d.fullName,
      AttendancePercentage: `${d.AttendancePct}%`
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");
    XLSX.writeFile(workbook, "Academic_Analytics.xlsx");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Reports & Matplotlib Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Visual academic progress metrics, attendance trends, and study hour distribution</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-600/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Subject Attendance % */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            Subject Attendance Breakdown (%)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="AttendancePct" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly Study Hours Line Graph */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Weekly Study Hours Trend
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="Hours" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
