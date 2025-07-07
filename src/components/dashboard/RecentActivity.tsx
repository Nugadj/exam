import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import { GlassCard } from '../ui/GlassCard';

export const RecentActivity: React.FC = () => {
  const { user } = useAuth();
  const { getExamHistory, exams } = useExam();

  if (!user) return null;

  const examHistory = getExamHistory(user.id);
  const recentAttempts = examHistory
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  const getExamTitle = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.title : 'Unknown Exam';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <GlassCard hover={false} className="h-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Recent Activity</h3>
        <p className="text-gray-400 text-sm">Your latest exam attempts</p>
      </div>

      {recentAttempts.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No exams taken yet</p>
          <p className="text-gray-500 text-sm">Start practicing to see your progress here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentAttempts.map((attempt, index) => (
            <motion.div
              key={attempt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-white font-medium truncate">
                  {getExamTitle(attempt.examId)}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={`text-lg font-bold ${getScoreColor(attempt.score)}`}>
                {attempt.score}%
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};