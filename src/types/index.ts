export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  status: 'trial' | 'paid' | 'expired';
  trialStartDate?: Date;
  trialEndDate?: Date;
  joinDate: Date;
  lastActive: Date;
  paymentReceipt?: string;
  paymentReference?: string;
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'none';
}

export interface Question {
  id: string;
  subject: Subject;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface Exam {
  id: string;
  subject: Subject;
  title: string;
  duration: number; // in minutes
  questions: Question[];
  totalPoints: number;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  answers: Record<string, number>;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: Date;
  markedQuestions: string[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  topics: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export interface ExamContextType {
  subjects: Subject[];
  questions: Question[];
  exams: Exam[];
  examAttempts: ExamAttempt[];
  currentExam: Exam | null;
  currentAttempt: ExamAttempt | null;
  startExam: (examId: string) => void;
  submitExam: (answers: Record<string, number>, markedQuestions: string[]) => void;
  getSubjectProgress: (subjectId: string) => number;
  getExamHistory: (userId: string) => ExamAttempt[];
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
}