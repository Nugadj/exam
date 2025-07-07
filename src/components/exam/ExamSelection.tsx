import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, BookOpen, Play, ArrowLeft } from 'lucide-react';
import { Subject, Exam } from '../../types';
import { useExam } from '../../contexts/ExamContext';
import { HolographicText } from '../ui/HolographicText';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';

interface ExamSelectionProps {
  subject: Subject;
  onStartExam: (exam: Exam) => void;
  onBack: () => void;
}

export const ExamSelection: React.FC<ExamSelectionProps> = ({ subject, onStartExam, onBack }) => {
  const { exams, questions } = useExam();
  const subjectExams = exams.filter(exam => exam.subject.id === subject.id);
  const subjectQuestions = questions.filter(q => q.subject.id === subject.id);

  const handleStartExam = (exam: Exam) => {
    if (subjectQuestions.length === 0) {
      alert('No questions available for this subject. Please contact admin to add questions.');
      return;
    }
    onStartExam(exam);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <HolographicText variant="h2" className="mb-2">
                {subject.name} Exams
              </HolographicText>
              <p className="text-gray-400">Choose an exam to test your knowledge</p>
            </div>
          </div>
        </motion.div>

        {subjectQuestions.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Questions Available</h3>
            <p className="text-gray-400">Questions for this subject need to be added by admin first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjectExams.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <GlassCard className="h-full">
                  <div className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-4`}>
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{exam.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-grow">
                      Test your knowledge with up to 50 questions
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Duration:</span>
                        <div className="flex items-center text-white">
                          <Clock className="w-4 h-4 mr-1" />
                          {exam.duration} minutes
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Questions:</span>
                        <span className="text-white">Up to 50</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Available:</span>
                        <span className="text-white">{Math.min(subjectQuestions.length, 50)}</span>
                      </div>
                    </div>
                    
                    <NeonButton
                      onClick={() => handleStartExam(exam)}
                      variant="primary"
                      size="sm"
                      className="w-full flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Exam
                    </NeonButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};