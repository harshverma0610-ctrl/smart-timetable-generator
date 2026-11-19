import React, { useState } from 'react';
import { FileCheck, Plus, Clock, AlertCircle, CheckCircle2, Trash2, X } from 'lucide-react';
import { Subject, Assignment } from '../types';

interface AssignmentTrackerProps {
  subjects: Subject[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

export const AssignmentTracker: React.FC<AssignmentTrackerProps> = ({
  subjects,
  assignments,
  setAssignments
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || 0,
    title: '',
    description: '',
    deadline: new Date().toISOString().split('T')[0],
    priority: 'High' as 'High' | 'Medium' | 'Low',
    marks: 100
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) return;

    const sub = subjects.find(s => s.id === Number(formData.subjectId));

    const newAssign: Assignment = {
      id: Date.now(),
      subjectId: Number(formData.subjectId),
      subjectName: sub ? sub.name : 'General Subject',
      title: formData.title,
      description: formData.description,
      deadline: formData.deadline,
      priority: formData.priority,
      status: 'Pending',
      marks: Number(formData.marks) || 100
    };

    setAssignments([newAssign, ...assignments]);
    setShowModal(false);
    setFormData({
      subjectId: subjects[0]?.id || 0,
      title: '',
      description: '',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'High',
      marks: 100
    });
  };

  const toggleStatus = (id: number) => {
    setAssignments(assignments.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete assignment entry?")) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Coursework, due dates and completion status</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Assignment</span>
        </button>
      </div>

      {/* Assignment List */}
      <div className="space-y-3">
        {assignments.map((a) => (
          <div
            key={a.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {a.subjectName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  a.priority === 'High' 
                    ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' 
                    : a.priority === 'Medium' 
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' 
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {a.priority} Priority
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {a.marks} marks
                </span>
              </div>

              <h3 className={`text-base font-bold ${a.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                {a.title}
              </h3>
              <p className="text-xs text-slate-500">{a.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Due: {a.deadline}
                </span>
              </div>

              <button
                onClick={() => toggleStatus(a.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  a.status === 'Completed'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{a.status}</span>
              </button>

              <button
                onClick={() => handleDelete(a.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full relative border border-slate-200 dark:border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Assignment</h2>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Title</label>
                <input
                  type="text"
                  placeholder="Assignment title"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Description</label>
                <textarea
                  placeholder="Task instructions..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-md transition-all"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
