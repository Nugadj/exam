import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, BookOpen, ArrowRight, RotateCcw } from 'lucide-react';
import { ExamAttempt, Exam } from '../../types';
import { HolographicText } from '../ui/HolographicText';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';

interface ExamResultsProps {
  attempt: ExamAttempt;
  exam: Exam;
  onRetakeExam: () => void;
  onBackToDashboard: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  attempt,
  exam,
  onRetakeExam,
  onBackToDashboard
}) => {
  const percentage = Math.round((attempt.score / exam.totalPoints) * 100);
  const correctAnswers = Object.keys(attempt.answers).filter(questionId => {
    const question = exam.questions.find(q => q.id === questionId);
    return question && attempt.answers[questionId] === question.correctAnswer;
  }).length;

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-400', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-400', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-400', message: 'Good Job!' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-400', message: 'Fair' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-400', message: 'Needs Improvement' };
    return { grade: 'F', color: 'text-red-400', message: 'Keep Practicing!' };
  };

  const gradeInfo = getGrade(percentage);

  const stats = [
    {
      title: 'Score',
      value: `${attempt.score}/${exam.totalPoints}`,
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Percentage',
      value: `${percentage}%`,
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Correct Answers',
      value: `${correctAnswers}/${exam.questions.length}`,
      icon: BookOpen,
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Time Spent',
      value: `${Math.round(attempt.timeSpent / 60)}m`,
      icon: Clock,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${stats[1].color} flex items-center justify-center mx-auto mb-6`}>
            <Trophy className="w-12 h-12 text-white" />
          </div>
          
          <HolographicText variant="h1" className="mb-4">
            Exam Complete!
          </HolographicText>
          
          <div className={`text-6xl font-bold ${gradeInfo.color} mb-2`}>
            {gradeInfo.grade}
          </div>
          
          <p className="text-xl text-gray-400 mb-2">{gradeInfo.message}</p>
          <p className="text-gray-500">{exam.title} - {exam.subject.name}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <GlassCard hover={false}>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.title}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassCard hover={false}>
            <h3 className="text-xl font-bold text-white mb-4">Question Breakdown</h3>
            <div className="space-y-3">
              {exam.questions.map((question, index) => {
                const userAnswer = attempt.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                const wasAnswered = userAnswer !== undefined;
                
                return (
                  <div key={question.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        !wasAnswered ? 'bg-gray-600 text-gray-300' :
                        isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {question.topic} - {question.difficulty}
                        </div>
                        <div className="text-xs text-gray-400">
                          {question.points} points
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      !wasAnswered ? 'text-gray-400' :
                      isCorrect ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {!wasAnswered ? 'Not Answered' : isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-xl font-bold text-white mb-4">Performance Analysis</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Overall Score</span>
                  <span className="text-white font-bold">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${
                      percentage >= 80 ? 'from-green-500 to-teal-500' :
                      percentage >= 60 ? 'from-yellow-500 to-orange-500' :
                      'from-red-500 to-pink-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-green-500/10 rounded-lg">
                  <div className="text-green-400 font-bold text-lg">{correctAnswers}</div>
                  <div className="text-gray-400">Correct</div>
                </div>
                <div className="text-center p-3 bg-red-500/10 rounded-lg">
                  <div className="text-red-400 font-bold text-lg">{exam.questions.length - correctAnswers}</div>
                  <div className="text-gray-400">Incorrect</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-white font-semibold mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  {percentage < 60 && (
                    <li>• Review fundamental concepts</li>
                  )}
                  {percentage < 80 && (
                    <li>• Practice more questions in weak areas</li>
                  )}
                  <li>• Take more practice tests</li>
                  <li>• Review explanations for incorrect answers</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="flex justify-center space-x-4">
          <NeonButton
            onClick={onRetakeExam}
            variant="primary"
            className="flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Exam
          </NeonButton>
          <NeonButton
            onClick={onBackToDashboard}
            variant="secondary"
            className="flex items-center"
          >
            Back to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </NeonButton>
        </div>
      </div>
    </div>
  );
};