import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import { GlassCard } from '../ui/GlassCard';
import { ProgressBar } from '../ui/ProgressBar';

export const ProgressOverview: React.FC = () => {
  const { user } = useAuth();
  const { subjects, getSubjectProgress, getExamHistory } = useExam();

  if (!user) return null;

  const examHistory = getExamHistory(user.id);
  const totalExams = examHistory.length;
  const averageScore = totalExams > 0 
    ? Math.round(examHistory.reduce((sum, attempt) => sum + attempt.score, 0) / totalExams)
    : 0;

  const overallProgress = subjects.reduce((sum, subject) => {
    return sum + getSubjectProgress(subject.id);
  }, 0) / subjects.length;

  const stats = [
    {
      title: 'Overall Progress',
      value: `${Math.round(overallProgress)}%`,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Exams Taken',
      value: totalExams.toString(),
      icon: Target,
      color: 'green'
    },
    {
      title: 'Average Score',
      value: `${averageScore}%`,
      icon: Award,
      color: 'purple'
    },
    {
      title: 'Study Time',
      value: `${Math.round(totalExams * 1.5)}h`,
      icon: Clock,
      color: 'red'
    }
  ];

  return (
    <GlassCard hover={false}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Progress Overview</h3>
        <p className="text-gray-400 text-sm">Track your learning journey</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="text-center"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Subject Progress</h4>
        {subjects.map((subject) => {
          const progress = getSubjectProgress(subject.id);
          return (
            <div key={subject.id} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-sm font-bold">
                  {subject.name.charAt(0)}
                </span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white text-sm font-medium">{subject.name}</span>
                  <span className="text-gray-400 text-sm">{Math.round(progress)}%</span>
                </div>
                <ProgressBar progress={progress} showLabel={false} />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};