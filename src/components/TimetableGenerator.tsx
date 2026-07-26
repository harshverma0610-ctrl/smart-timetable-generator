import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer, 
  FileSpreadsheet, 
  QrCode, 
  Download, 
  Trash2, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { Subject, TimetableSlot, DayOfWeek } from '../types';
import { TIME_SLOTS_LIST } from '../data/mockDatabase';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface TimetableGeneratorProps {
  subjects: Subject[];
  timetable: TimetableSlot[];
  setTimetable: React.Dispatch<React.SetStateAction<TimetableSlot[]>>;
}

export const TimetableGenerator: React.FC<TimetableGeneratorProps> = ({
  subjects,
  timetable,
  setTimetable
}) => {
  const [avoidConsecutiveHard, setAvoidConsecutiveHard] = useState(true);
  const [maxClassesPerDay, setMaxClassesPerDay] = useState(4);
  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday");
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Automatic Timetable Constraint Solver Algorithm
  const handleAutoGenerate = () => {
    if (subjects.length === 0) {
      alert("Please add subjects in the Subject Manager first!");
      return;
    }

    const newSlots: TimetableSlot[] = [];
    let slotId = 1;
    const subjectCreditCounter: Record<number, number> = {};
    subjects.forEach(s => { subjectCreditCounter[s.id] = 0; });

    const lectureSlots = TIME_SLOTS_LIST.filter(slot => !slot.includes("Lunch"));

    days.forEach((day) => {
      let classesToday = 0;
      let lastDifficulty: "Easy" | "Medium" | "Hard" | null = null;

      TIME_SLOTS_LIST.forEach((timeSlot) => {
        if (timeSlot.includes("Lunch")) {
          newSlots.push({
            id: slotId++,
            day,
            slotTime: timeSlot,
            subjectId: 0,
            subjectName: "LUNCH BREAK",
            subjectCode: "LUNCH",
            faculty: "N/A",
            classroom: "Student Cafeteria",
            colorLabel: "#64748b",
            slotType: "Lunch"
          });
          return;
        }

        if (classesToday >= maxClassesPerDay) return;

        // Candidate filter
        const candidates = subjects.filter(s => {
          if (subjectCreditCounter[s.id] >= s.credits) return false;
          if (avoidConsecutiveHard && lastDifficulty === "Hard" && s.difficulty === "Hard") return false;
          return true;
        });

        const pool = candidates.length > 0 ? candidates : subjects.filter(s => subjectCreditCounter[s.id] < s.credits);
        if (pool.length === 0) return;

        // Choose subject with lowest credits assigned so far to balance workload
        const chosen = pool.reduce((prev, curr) => 
          (subjectCreditCounter[curr.id] < subjectCreditCounter[prev.id] ? curr : prev)
        );

        subjectCreditCounter[chosen.id]++;
        classesToday++;
        lastDifficulty = chosen.difficulty;

        const isLab = chosen.credits >= 4 && classesToday >= 3;

        newSlots.push({
          id: slotId++,
          day,
          slotTime: timeSlot,
          subjectId: chosen.id,
          subjectName: chosen.name,
          subjectCode: chosen.code,
          faculty: chosen.faculty,
          classroom: chosen.classroom,
          colorLabel: chosen.colorLabel,
          slotType: isLab ? "Lab" : "Lecture"
        });
      });
    });

    setTimetable(newSlots);
  };

  const handleClear = () => {
    if (confirm("Clear all generated timetable slots?")) {
      setTimetable([]);
    }
  };

  // Generate QR Code
  const handleGenerateQr = async () => {
    try {
      const summary = timetable
        .filter(t => t.slotType !== 'Lunch')
        .slice(0, 10)
        .map(t => `${t.day.slice(0,3)} ${t.slotTime.split(" ")[0]}: ${t.subjectCode}`)
        .join("\n");
      const url = await QRCode.toDataURL(`SMART TIMETABLE SCHEDULE:\n${summary}`);
      setQrDataUrl(url);
      setShowQrModal(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Export PDF Report
  const handleExportPdf = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.text('Smart Timetable Generator - Weekly Schedule Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Subjects: ${subjects.length}`, 14, 22);

    const tableData: string[][] = [];
    days.forEach(day => {
      TIME_SLOTS_LIST.forEach(slotTime => {
        const entry = timetable.find(t => t.day === day && t.slotTime === slotTime);
        if (entry) {
          tableData.push([day, slotTime, entry.subjectCode, entry.subjectName, entry.faculty, entry.classroom, entry.slotType]);
        }
      });
    });

    autoTable(doc, {
      startY: 28,
      head: [['Day', 'Time Slot', 'Code', 'Subject Name', 'Faculty', 'Room', 'Type']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save('Smart_Timetable_Report.pdf');
  };

  // Export Excel Report
  const handleExportExcel = () => {
    const excelData = timetable.map(t => ({
      Day: t.day,
      TimeSlot: t.slotTime,
      SubjectCode: t.subjectCode,
      SubjectName: t.subjectName,
      Faculty: t.faculty,
      Classroom: t.classroom,
      SlotType: t.slotType
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
    XLSX.writeFile(workbook, "Smart_Timetable_Export.xlsx");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Smart Timetable Auto-Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero teacher & classroom conflict constraint engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAutoGenerate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Auto-Generate</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-red-500" />
            <span>PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Excel</span>
          </button>

          <button
            onClick={handleGenerateQr}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-4 h-4 text-indigo-500" />
            <span>QR Share</span>
          </button>

          <button
            onClick={handleClear}
            className="px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 font-semibold text-xs transition-colors"
            title="Clear Timetable"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Constraints Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={avoidConsecutiveHard}
              onChange={(e) => setAvoidConsecutiveHard(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Avoid Consecutive Difficult Subjects</span>
          </label>

          <div className="flex items-center gap-2">
            <span>Max Classes Per Day:</span>
            <select
              value={maxClassesPerDay}
              onChange={(e) => setMaxClassesPerDay(Number(e.target.value))}
              className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              <option value={3}>3 Classes</option>
              <option value={4}>4 Classes</option>
              <option value={5}>5 Classes</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "weekly" ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Weekly Grid
          </button>
          <button
            onClick={() => setViewMode("daily")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "daily" ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Daily View
          </button>
        </div>
      </div>

      {/* Timetable Weekly Matrix Grid */}
      {viewMode === "weekly" ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                <th className="p-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 w-36">Day / Slot</th>
                {TIME_SLOTS_LIST.map((slot) => (
                  <th key={slot} className="p-3 text-center text-[11px] font-bold text-slate-600 dark:text-slate-400 min-w-[130px]">
                    {slot.split(" - ")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {days.map((day) => (
                <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-bold text-xs text-slate-800 dark:text-slate-200 bg-slate-50/80 dark:bg-slate-800/40">
                    {day}
                  </td>
                  {TIME_SLOTS_LIST.map((slotTime) => {
                    const entry = timetable.find(t => t.day === day && t.slotTime === slotTime);
                    if (slotTime.includes("Lunch")) {
                      return (
                        <td key={slotTime} className="p-2 bg-slate-100/80 dark:bg-slate-800/80 text-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            🍱 LUNCH
                          </span>
                        </td>
                      );
                    }
                    return (
                      <td key={slotTime} className="p-2">
                        {entry ? (
                          <div
                            className="p-2.5 rounded-xl text-white shadow-sm transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: entry.colorLabel }}
                          >
                            <p className="text-xs font-extrabold leading-tight">{entry.subjectName}</p>
                            <p className="text-[10px] text-white/80 font-medium mt-0.5">{entry.subjectCode}</p>
                            <div className="flex items-center justify-between text-[9px] text-white/90 font-semibold mt-1.5 pt-1 border-t border-white/20">
                              <span>🏫 {entry.classroom}</span>
                              <span className="uppercase px-1 rounded bg-black/20">{entry.slotType}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400">
                            Free Slot
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Daily View */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === d ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {timetable.filter(t => t.day === selectedDay).map(slot => (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-12 rounded-full" style={{ backgroundColor: slot.colorLabel }} />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{slot.subjectName} ({slot.subjectCode})</h3>
                    <p className="text-xs text-slate-500">Faculty: {slot.faculty} • Venue: {slot.classroom}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950">
                  {slot.slotTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Share Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full text-center relative border border-slate-200 dark:border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Share Timetable via QR</h3>
            <p className="text-xs text-slate-500 mb-4">Scan with smartphone camera to sync schedule</p>

            {qrDataUrl && (
              <img src={qrDataUrl} alt="Timetable QR" className="w-48 h-48 mx-auto rounded-xl shadow-md border border-slate-200 p-2" />
            )}

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
