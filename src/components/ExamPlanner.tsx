import React, { useState } from 'react';
import { GraduationCap, Plus, Calendar, MapPin, BookOpen, Clock, X, Trash2 } from 'lucide-react';
import { Subject, Exam } from '../types';

interface ExamPlannerProps {
  subjects: Subject[];
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
}

export const ExamPlanner: React.FC<ExamPlannerProps> = ({ subjects, exams, setExams }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || 0,
    date: new Date().toISOString().split('T')[0],
    time: '09:30 AM - 12:30 PM',
    venue: 'Main Examination Hall A',
    syllabus: 'Chapters 1 to 5'
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === Number(formData.subjectId));

    const newExam: Exam = {
      id: Date.now(),
      subjectId: Number(formData.subjectId),
      subjectName: sub ? sub.name : 'General Subject',
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      syllabus: formData.syllabus,
      status: 'Upcoming'
    };

    setExams([...exams, newExam]);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete exam entry?")) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            Exam Scheduler & Revision Planner
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage exam dates, venues, syllabus coverage, and study countdowns</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Exam</span>
        </button>
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((ex) => {
          const diff = new Date(ex.date).getTime() - new Date().getTime();
          const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));

          return (
            <div
              key={ex.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                    {ex.subjectName}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    Exam Schedule
                  </h3>
                </div>
                <button onClick={() => handleDelete(ex.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900 text-center">
                <span className="text-2xl font-black text-violet-600 dark:text-violet-400">
                  ⏳ {daysLeft} Days Left
                </span>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Exam Date: {ex.date}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Time: {ex.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Venue: {ex.venue}</span>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">Syllabus: {ex.syllabus}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full relative border border-slate-200 dark:border-slate-800 shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Schedule Exam</h2>

            <form onSubmit={handleCreateExam} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Subject</label>
                <select
                  value={formData.subjectId}
                  onChange={e => setFormData({...formData, subjectId: Number(e.target.value)})}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Time Slot</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={e => setFormData({...formData, venue: e.target.value})}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Syllabus Topics</label>
                <input
                  type="text"
                  value={formData.syllabus}
                  onChange={e => setFormData({...formData, syllabus: e.target.value})}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 shadow-md transition-all"
              >
                Save Exam Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
