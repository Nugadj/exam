import React, { createContext, useContext, useEffect, useState } from 'react';
import { Subject, Question, Exam, ExamAttempt, ExamContextType } from '../types';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    icon: 'Calculator',
    color: 'from-blue-500 to-cyan-500',
    description: 'Advanced mathematical concepts and problem-solving',
    topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry']
  },
  {
    id: '2',
    name: 'Physics',
    icon: 'Atom',
    color: 'from-purple-500 to-pink-500',
    description: 'Fundamental physics principles and applications',
    topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics']
  },
  {
    id: '3',
    name: 'Computer Science',
    icon: 'Code',
    color: 'from-green-500 to-teal-500',
    description: 'Programming, algorithms, and computational thinking',
    topics: ['Data Structures', 'Algorithms', 'Programming', 'Database', 'Networks']
  }
];

// Create 20 exams per subject with 50 questions each (placeholder structure)
const createExamsForSubject = (subject: Subject): Exam[] => {
  const exams: Exam[] = [];
  
  for (let i = 1; i <= 20; i++) {
    exams.push({
      id: `${subject.id}-exam-${i}`,
      subject,
      title: `${subject.name} Exam ${i}`,
      duration: 90, // 90 minutes for 50 questions
      questions: [], // Will be populated when questions are added via admin
      totalPoints: 500 // 50 questions × 10 points each
    });
  }
  
  return exams;
};

const createMockExams = (): Exam[] => {
  const allExams: Exam[] = [];
  
  mockSubjects.forEach(subject => {
    const subjectExams = createExamsForSubject(subject);
    allExams.push(...subjectExams);
  });
  
  return allExams;
};

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects] = useState<Subject[]>(mockSubjects);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams] = useState<Exam[]>(createMockExams());
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const storedAttempts = localStorage.getItem('examAttempts');
    if (storedAttempts) {
      setExamAttempts(JSON.parse(storedAttempts));
    }
    
    const storedQuestions = localStorage.getItem('examQuestions');
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, []);

  const addQuestion = (question: Question) => {
    const newQuestions = [...questions, question];
    setQuestions(newQuestions);
    localStorage.setItem('examQuestions', JSON.stringify(newQuestions));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );
    setQuestions(updatedQuestions);
    localStorage.setItem('examQuestions', JSON.stringify(updatedQuestions));
  };

  const deleteQuestion = (questionId: string) => {
    const filteredQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(filteredQuestions);
    localStorage.setItem('examQuestions', JSON.stringify(filteredQuestions));
  };

  const startExam = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam && user) {
      // Get questions for this exam (first 50 questions of the subject)
      const subjectQuestions = questions.filter(q => q.subject.id === exam.subject.id).slice(0, 50);
      
      if (subjectQuestions.length === 0) {
        alert('No questions available for this exam. Please contact admin.');
        return;
      }
      
      const examWithQuestions = { ...exam, questions: subjectQuestions };
      
      const attempt: ExamAttempt = {
        id: uuidv4(),
        userId: user.id,
        examId,
        answers: {},
        score: 0,
        totalQuestions: subjectQuestions.length,
        timeSpent: 0,
        completedAt: new Date(),
        markedQuestions: []
      };
      setCurrentExam(examWithQuestions);
      setCurrentAttempt(attempt);
    }
  };

  const submitExam = (answers: Record<string, number>, markedQuestions: string[]) => {
    if (!currentExam || !currentAttempt || !user) return;

    let score = 0;
    let totalPoints = 0;

    currentExam.questions.forEach(question => {
      totalPoints += question.points;
      if (answers[question.id] === question.correctAnswer) {
        score += question.points;
      }
    });

    const completedAttempt: ExamAttempt = {
      ...currentAttempt,
      answers,
      score,
      markedQuestions,
      completedAt: new Date()
    };

    const updatedAttempts = [...examAttempts, completedAttempt];
    setExamAttempts(updatedAttempts);
    localStorage.setItem('examAttempts', JSON.stringify(updatedAttempts));

    setCurrentExam(null);
    setCurrentAttempt(null);
  };

  const getSubjectProgress = (subjectId: string): number => {
    if (!user) return 0;
    
    const subjectAttempts = examAttempts.filter(
      attempt => attempt.userId === user.id && 
      exams.find(exam => exam.id === attempt.examId)?.subject.id === subjectId
    );
    
    if (subjectAttempts.length === 0) return 0;
    
    const totalScore = subjectAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const subjectExams = exams.filter(exam => exam.subject.id === subjectId);
    const maxPossibleScore = subjectExams.reduce((sum, exam) => sum + exam.totalPoints, 0);
    
    if (maxPossibleScore === 0) return 0;
    
    return Math.round((totalScore / maxPossibleScore) * 100);
  };

  const getExamHistory = (userId: string): ExamAttempt[] => {
    return examAttempts.filter(attempt => attempt.userId === userId);
  };

  return (
    <ExamContext.Provider value={{
      subjects,
      questions,
      exams,
      examAttempts,
      currentExam,
      currentAttempt,
      startExam,
      submitExam,
      getSubjectProgress,
      getExamHistory,
      addQuestion,
      updateQuestion,
      deleteQuestion
    }}>
      {children}
    </ExamContext.Provider>
  );
};