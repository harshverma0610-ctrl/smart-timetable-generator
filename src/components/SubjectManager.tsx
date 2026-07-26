import React, { useState } from 'react';
import { Plus, Trash2, Edit2, BookOpen, User, MapPin, Award, X, Sparkles } from 'lucide-react';
import { Subject } from '../types';

interface SubjectManagerProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

export const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, setSubjects }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    faculty: '',
    classroom: '',
    credits: 3,
    teacherEmail: '',
    colorLabel: '#3b82f6',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard'
  });

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;

    const newSub: Subject = {
      id: Date.now(),
      code: formData.code,
      name: formData.name,
      faculty: formData.faculty || 'Faculty Member',
      classroom: formData.classroom || 'Hall A',
      credits: Number(formData.credits) || 3,
      teacherEmail: formData.teacherEmail,
      colorLabel: formData.colorLabel,
      difficulty: formData.difficulty
    };

    setSubjects([...subjects, newSub]);
    setShowModal(false);
    setFormData({
      code: '',
      name: '',
      faculty: '',
      classroom: '',
      credits: 3,
      teacherEmail: '',
      colorLabel: '#3b82f6',
      difficulty: 'Medium'
    });
  };

  const handleDeleteSubject = (id: number) => {
    if (confirm("Delete this subject? Associated timetable slots will also be updated.")) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Subject Management Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage course details, credit loads, classrooms, and color badges</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subjects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-all"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: sub.colorLabel }}
            />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {sub.code}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                  {sub.name}
                </h2>
              </div>
              <button
                onClick={() => handleDeleteSubject(sub.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Delete Subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{sub.faculty}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Classroom: {sub.classroom}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Credits: {sub.credits} Hrs
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  sub.difficulty === 'Hard' 
                    ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' 
                    : sub.difficulty === 'Medium' 
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' 
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {sub.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full relative border border-slate-200 dark:border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New Subject</h2>

            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Subject Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS-501"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Algorithms & Data Structures"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Faculty Name</label>
                  <input
                    type="text"
                    placeholder="Prof. Smith"
                    value={formData.faculty}
                    onChange={e => setFormData({...formData, faculty: e.target.value})}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Classroom</label>
                  <input
                    type="text"
                    placeholder="Hall CS-1"
                    value={formData.classroom}
                    onChange={e => setFormData({...formData, classroom: e.target.value})}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Credit Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={formData.credits}
                    onChange={e => setFormData({...formData, credits: Number(e.target.value)})}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={e => setFormData({...formData, difficulty: e.target.value as any})}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Badge Color</label>
                <input
                  type="color"
                  value={formData.colorLabel}
                  onChange={e => setFormData({...formData, colorLabel: e.target.value})}
                  className="w-full h-9 p-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md transition-all"
              >
                Save Subject
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
