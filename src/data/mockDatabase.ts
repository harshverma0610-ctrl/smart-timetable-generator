import { 
  StudentUser, 
  Subject, 
  TimetableSlot, 
  Assignment, 
  AttendanceRecord, 
  Exam, 
  StudyGoal, 
  SystemNotification,
  DayOfWeek 
} from '../types';

export const TIME_SLOTS_LIST = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM (Lunch)",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM"
];

export const INITIAL_USER: StudentUser = {
  id: 1,
  name: "Alex Rivera",
  rollNumber: "2024-CS-402",
  department: "Computer Science & Engineering",
  semester: "Semester 5",
  section: "Section A",
  email: "alex.rivera@university.edu",
  phone: "+1 (555) 019-2834",
  username: "arivera",
  cgpa: 3.82,
  skills: ["Python", "Algorithms", "Database Systems", "React", "Cloud Computing"],
  goals: ["Maintain >3.8 CGPA", "Complete Major Capstone Project", "Secure Summer Internship"],
  achievements: ["Dean's Honor List 2024", "1st Place Hackathon Winner", "Academic Excellence Award"],
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 101,
    code: "CS-501",
    name: "Design & Analysis of Algorithms",
    faculty: "Dr. Robert Vance",
    credits: 4,
    classroom: "Hall A-201",
    teacherEmail: "r.vance@university.edu",
    colorLabel: "#3b82f6", // Blue
    difficulty: "Hard"
  },
  {
    id: 102,
    code: "CS-502",
    name: "Database Management Systems",
    faculty: "Prof. Sarah Jenkins",
    credits: 4,
    classroom: "Lab CS-3",
    teacherEmail: "s.jenkins@university.edu",
    colorLabel: "#22c55e", // Green
    difficulty: "Medium"
  },
  {
    id: 103,
    code: "CS-503",
    name: "Operating Systems",
    faculty: "Dr. Marcus Thorne",
    credits: 3,
    classroom: "Hall B-104",
    teacherEmail: "m.thorne@university.edu",
    colorLabel: "#8b5cf6", // Purple
    difficulty: "Hard"
  },
  {
    id: 104,
    code: "CS-504",
    name: "Computer Networks",
    faculty: "Prof. Elena Rostova",
    credits: 3,
    classroom: "Hall C-102",
    teacherEmail: "e.rostova@university.edu",
    colorLabel: "#f59e0b", // Amber
    difficulty: "Medium"
  },
  {
    id: 105,
    code: "CS-505",
    name: "Software Engineering",
    faculty: "Dr. Alan Turing",
    credits: 3,
    classroom: "Hall A-101",
    teacherEmail: "a.turing@university.edu",
    colorLabel: "#ec4899", // Pink
    difficulty: "Easy"
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    subjectId: 101,
    subjectName: "Design & Analysis of Algorithms",
    title: "Dynamic Programming & Graph Traversal",
    description: "Implement Bellman-Ford and Floyd-Warshall shortest path algorithms in Python with performance benchmarking.",
    deadline: "2026-07-28",
    priority: "High",
    status: "Pending",
    marks: 100
  },
  {
    id: 2,
    subjectId: 102,
    subjectName: "Database Management Systems",
    title: "SQL Indexing & Normalization Problem Set",
    description: "Complete B+ Tree indexing optimization exercises and 3NF/BCNF database schema refactoring.",
    deadline: "2026-07-30",
    priority: "High",
    status: "In Progress",
    marks: 50
  },
  {
    id: 3,
    subjectId: 103,
    subjectName: "Operating Systems",
    title: "Process Synchronization & Semaphores",
    description: "Solve the Producer-Consumer and Dining Philosophers problem using C mutex locks.",
    deadline: "2026-08-02",
    priority: "Medium",
    status: "Pending",
    marks: 75
  },
  {
    id: 4,
    subjectId: 105,
    subjectName: "Software Engineering",
    title: "UML Class & Sequence Diagrams",
    description: "Submit architecture design documentation for the e-commerce domain model.",
    deadline: "2026-07-25",
    priority: "Low",
    status: "Completed",
    marks: 50
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 1,
    subjectId: 101,
    subjectName: "Design & Analysis of Algorithms",
    date: "2026-08-10",
    time: "09:30 AM - 12:30 PM",
    venue: "Main Examination Hall A",
    syllabus: "Divide & Conquer, Greedy Algorithms, Dynamic Programming, NP-Completeness",
    status: "Upcoming"
  },
  {
    id: 2,
    subjectId: 102,
    subjectName: "Database Management Systems",
    date: "2026-08-12",
    time: "02:00 PM - 05:00 PM",
    venue: "Examination Hall B",
    syllabus: "Relational Algebra, SQL, Transactions, Concurrency Control, B+ Trees",
    status: "Upcoming"
  },
  {
    id: 3,
    subjectId: 103,
    subjectName: "Operating Systems",
    date: "2026-08-15",
    time: "09:30 AM - 12:30 PM",
    venue: "Main Hall A",
    syllabus: "Processes, Threads, CPU Scheduling, Memory Management, File Systems",
    status: "Upcoming"
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 1, subjectId: 101, date: "2026-07-01", status: "Present" },
  { id: 2, subjectId: 101, date: "2026-07-03", status: "Present" },
  { id: 3, subjectId: 101, date: "2026-07-08", status: "Absent" },
  { id: 4, subjectId: 101, date: "2026-07-10", status: "Present" },
  { id: 5, subjectId: 101, date: "2026-07-15", status: "Present" },
  { id: 6, subjectId: 101, date: "2026-07-17", status: "Late" },
  { id: 7, subjectId: 101, date: "2026-07-22", status: "Present" },

  { id: 8, subjectId: 102, date: "2026-07-02", status: "Present" },
  { id: 9, subjectId: 102, date: "2026-07-04", status: "Present" },
  { id: 10, subjectId: 102, date: "2026-07-09", status: "Present" },
  { id: 11, subjectId: 102, date: "2026-07-11", status: "Medical" },
  { id: 12, subjectId: 102, date: "2026-07-16", status: "Present" },

  { id: 13, subjectId: 103, date: "2026-07-01", status: "Absent" },
  { id: 14, subjectId: 103, date: "2026-07-05", status: "Absent" },
  { id: 15, subjectId: 103, date: "2026-07-12", status: "Present" },
  { id: 16, subjectId: 103, date: "2026-07-19", status: "Present" },

  { id: 17, subjectId: 104, date: "2026-07-03", status: "Present" },
  { id: 18, subjectId: 104, date: "2026-07-10", status: "Present" },
  { id: 19, subjectId: 104, date: "2026-07-17", status: "Present" },

  { id: 20, subjectId: 105, date: "2026-07-04", status: "Present" },
  { id: 21, subjectId: 105, date: "2026-07-11", status: "Present" },
  { id: 22, subjectId: 105, date: "2026-07-18", status: "Present" }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 1,
    title: "High Priority Assignment Due Soon",
    message: "Dynamic Programming assignment for Design & Analysis of Algorithms is due in 3 days.",
    category: "Assignment",
    time: "10 mins ago",
    isRead: false
  },
  {
    id: 2,
    title: "Operating Systems Attendance Warning",
    message: "Your attendance in Operating Systems is 60.0% (below 75%). Attend next 2 classes to hit safety threshold.",
    category: "Attendance",
    time: "2 hours ago",
    isRead: false
  },
  {
    id: 3,
    title: "Upcoming Exam Countdown",
    message: "Design & Analysis of Algorithms exam is scheduled for August 10, 2026 (17 days left).",
    category: "Exam",
    time: "1 day ago",
    isRead: true
  }
];

// Helper to generate a default timetable schedule
export function generateInitialTimetable(subjects: Subject[]): TimetableSlot[] {
  const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots: TimetableSlot[] = [];
  let slotCounter = 1;

  days.forEach((day, dIdx) => {
    TIME_SLOTS_LIST.forEach((timeSlot, sIdx) => {
      if (timeSlot.includes("Lunch")) {
        slots.push({
          id: slotCounter++,
          day,
          slotTime: timeSlot,
          subjectId: 0,
          subjectName: "LUNCH BREAK",
          subjectCode: "LUNCH",
          faculty: "N/A",
          classroom: "Cafeteria / Student Lounge",
          colorLabel: "#64748b",
          slotType: "Lunch"
        });
      } else if ((dIdx + sIdx) % 3 !== 0 && subjects.length > 0) {
        const sub = subjects[(dIdx * 2 + sIdx) % subjects.length];
        const isLab = sub.credits >= 4 && sIdx >= 5;
        slots.push({
          id: slotCounter++,
          day,
          slotTime: timeSlot,
          subjectId: sub.id,
          subjectName: sub.name,
          subjectCode: sub.code,
          faculty: sub.faculty,
          classroom: sub.classroom,
          colorLabel: sub.colorLabel,
          slotType: isLab ? "Lab" : "Lecture"
        });
      }
    });
  });

  return slots;
}
