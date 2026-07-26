import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Sparkles, CheckCircle2, Flame, Award } from 'lucide-react';
import { Subject, StudyGoal } from '../types';

interface StudyPlannerProps {
  subjects: Subject[];
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ subjects }) => {
  // Pomodoro Timer State
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(3);
  const [mode, setMode] = useState<"work" | "break">("work");

  // Study Goals state
  const [goals, setGoals] = useState<StudyGoal[]>([
    { id: 1, subjectId: 101, subjectName: "Design & Analysis of Algorithms", targetMinutes: 45, completedMinutes: 45, difficulty: "Hard", isDone: true },
    { id: 2, subjectId: 102, subjectName: "Database Management Systems", targetMinutes: 30, completedMinutes: 15, difficulty: "Medium", isDone: false },
    { id: 3, subjectId: 103, subjectName: "Operating Systems", targetMinutes: 45, completedMinutes: 0, difficulty: "Hard", isDone: false },
  ]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(sec => sec - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      if (mode === "work") {
        setSessionCount(c => c + 1);
        setMode("break");
        setSecondsLeft(5 * 60);
      } else {
        setMode("work");
        setSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode("work");
    setSecondsLeft(25 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate study goals automatically prioritizing weak/hard subjects
  const handleGenerateGoals = () => {
    const hardSubjects = [...subjects].sort((a, b) => (a.difficulty === 'Hard' ? -1 : 1));
    const newGoals: StudyGoal[] = hardSubjects.slice(0, 4).map((sub, idx) => ({
      id: Date.now() + idx,
      subjectId: sub.id,
      subjectName: sub.name,
      targetMinutes: sub.difficulty === 'Hard' ? 45 : 30,
      completedMinutes: 0,
      difficulty: sub.difficulty,
      isDone: false
    }));
    setGoals(newGoals);
  };

  const toggleGoalDone = (id: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, isDone: !g.isDone } : g));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Timer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Smart Study Planner & Pomodoro Focus Timer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Optimize study time allocation, track focus sessions, and maintain daily study streaks</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>4 Day Study Streak!</span>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pomodoro Timer Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {mode === "work" ? "🧠 Deep Work Focus" : "☕ Short Break"}
            </span>
            <p className="text-xs text-slate-500 mt-2">Pomodoro Session #{sessionCount} Completed</p>
          </div>

          <div className="text-6xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white font-mono my-2">
            {formatTime(secondsLeft)}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTimer}
              className={`px-6 py-3 rounded-xl font-bold text-xs text-white shadow-lg flex items-center gap-2 transition-all ${
                isActive ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause Timer' : 'Start Focus'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: AI Study Goal Optimizer */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Study Goal Optimizer</h2>
              <p className="text-xs text-slate-500">Auto-allocates study time based on subject difficulty</p>
            </div>
            <button
              onClick={handleGenerateGoals}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize Goals</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {goals.map((g) => (
              <div
                key={g.id}
                onClick={() => toggleGoalDone(g.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  g.isDone 
                    ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60' 
                    : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-5 h-5 ${g.isDone ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <div>
                    <h3 className={`text-xs font-bold ${g.isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {g.subjectName}
                    </h3>
                    <p className="text-[11px] text-slate-500">Target Duration: {g.targetMinutes} Mins • {g.difficulty}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  g.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {g.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
