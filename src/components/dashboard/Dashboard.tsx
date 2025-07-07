import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import { Subject, Exam, ExamAttempt } from '../../types';
import { SubjectCard } from './SubjectCard';
import { ProgressOverview } from './ProgressOverview';
import { RecentActivity } from './RecentActivity';
import { UpgradePrompt } from './UpgradePrompt';
import { AdminPanel } from '../admin/AdminPanel';
import { ExamSelection } from '../exam/ExamSelection';
import { ExamInterface } from '../exam/ExamInterface';
import { ExamResults } from '../exam/ExamResults';
import { PracticeMode } from '../practice/PracticeMode';
import { HolographicText } from '../ui/HolographicText';

type ViewMode = 'dashboard' | 'practice' | 'exam-selection' | 'exam' | 'exam-results';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subjects, submitExam, startExam, currentExam, exams } = useExam();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [lastExamAttempt, setLastExamAttempt] = useState<ExamAttempt | null>(null);

  if (!user) return null;

  if (user.role === 'admin') {
    return <AdminPanel />;
  }

  if (user.status === 'expired') {
    return <UpgradePrompt />;
  }

  const handleStartPractice = (subject: Subject) => {
    setSelectedSubject(subject);
    setViewMode('practice');
  };

  const handleTakeExam = (subject: Subject) => {
    setSelectedSubject(subject);
    setViewMode('exam-selection');
  };

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    startExam(exam.id);
    setViewMode('exam');
  };

  const handleCompleteExam = (answers: Record<string, number>, markedQuestions: string[]) => {
    if (!selectedExam || !user) return;
    
    // Calculate score
    let score = 0;
    selectedExam.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score += question.points;
      }
    });

    const attempt: ExamAttempt = {
      id: Date.now().toString(),
      userId: user.id,
      examId: selectedExam.id,
      answers,
      score,
      totalQuestions: selectedExam.questions.length,
      timeSpent: selectedExam.duration * 60, // Mock time spent
      completedAt: new Date(),
      markedQuestions
    };

    submitExam(answers, markedQuestions);
    setLastExamAttempt(attempt);
    setViewMode('exam-results');
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setSelectedSubject(null);
    setSelectedExam(null);
    setLastExamAttempt(null);
  };

  const handleRetakeExam = () => {
    if (selectedExam) {
      handleStartExam(selectedExam);
    }
  };

  // Render different views based on current mode
  switch (viewMode) {
    case 'practice':
      return selectedSubject ? (
        <PracticeMode 
          subject={selectedSubject} 
          onBack={handleBackToDashboard}
        />
      ) : null;

    case 'exam-selection':
      return selectedSubject ? (
        <ExamSelection
          subject={selectedSubject}
          onStartExam={handleStartExam}
          onBack={handleBackToDashboard}
        />
      ) : null;

    case 'exam':
      return selectedExam ? (
        <ExamInterface
          exam={selectedExam}
          onComplete={handleCompleteExam}
          onExit={handleBackToDashboard}
        />
      ) : null;

    case 'exam-results':
      return selectedExam && lastExamAttempt ? (
        <ExamResults
          attempt={lastExamAttempt}
          exam={selectedExam}
          onRetakeExam={handleRetakeExam}
          onBackToDashboard={handleBackToDashboard}
        />
      ) : null;

    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <HolographicText variant="h2" className="mb-2">
                Welcome back, {user.name}
              </HolographicText>
              <p className="text-gray-400">
                Ready to continue your learning journey?
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <ProgressOverview />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Subjects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <SubjectCard 
                      subject={subject} 
                      onStartPractice={handleStartPractice}
                      onTakeExam={handleTakeExam}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      );
  }
};