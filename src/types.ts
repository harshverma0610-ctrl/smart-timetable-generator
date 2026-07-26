export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export interface StudentUser {
  id: number;
  name: string;
  rollNumber: string;
  department: string;
  semester: string;
  section: string;
  email: string;
  phone: string;
  username: string;
  cgpa: number;
  skills: string[];
  goals: string[];
  achievements: string[];
  avatarUrl?: string;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  faculty: string;
  credits: number;
  classroom: string;
  teacherEmail: string;
  colorLabel: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface TimetableSlot {
  id: number;
  day: DayOfWeek;
  slotTime: string;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  faculty: string;
  classroom: string;
  colorLabel: string;
  slotType: "Lecture" | "Lab" | "Tutorial" | "Lunch";
}

export interface Assignment {
  id: number;
  subjectId: number;
  subjectName: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Submitted" | "Completed";
  marks: number;
}

export interface AttendanceRecord {
  id: number;
  subjectId: number;
  date: string; // YYYY-MM-DD
  status: "Present" | "Absent" | "Late" | "Medical";
  notes?: string;
}

export interface Exam {
  id: number;
  subjectId: number;
  subjectName: string;
  date: string; // YYYY-MM-DD
  time: string;
  venue: string;
  syllabus: string;
  status: "Upcoming" | "Completed";
}

export interface StudyGoal {
  id: number;
  subjectId: number;
  subjectName: string;
  targetMinutes: number;
  completedMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  isDone: boolean;
}

export interface SystemNotification {
  id: number;
  title: string;
  message: string;
  category: "Class" | "Assignment" | "Exam" | "Attendance" | "System";
  time: string;
  isRead: boolean;
}
