import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flag, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Exam, Question } from '../../types';
import { useExam } from '../../contexts/ExamContext';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { HolographicText } from '../ui/HolographicText';

interface ExamInterfaceProps {
  exam: Exam;
  onComplete: (answers: Record<string, number>, markedQuestions: string[]) => void;
  onExit: () => void;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({ exam, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60); // Convert to seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          onComplete(answers, markedQuestions);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answers, markedQuestions, onComplete]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleMarkQuestion = () => {
    setMarkedQuestions(prev => {
      if (prev.includes(currentQuestion.id)) {
        return prev.filter(id => id !== currentQuestion.id);
      } else {
        return [...prev, currentQuestion.id];
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(answers, markedQuestions);
  };

  const getQuestionStatus = (questionId: string, index: number) => {
    if (answers[questionId] !== undefined) return 'answered';
    if (markedQuestions.includes(questionId)) return 'marked';
    if (index === currentQuestionIndex) return 'current';
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500';
      case 'marked': return 'bg-yellow-500';
      case 'current': return 'bg-blue-500';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onExit}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <HolographicText variant="h3">{exam.title}</HolographicText>
              <p className="text-gray-400">{exam.subject.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-5 h-5" />
              <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="text-white">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <GlassCard hover={false}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                      {currentQuestion.topic}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                      {currentQuestion.points} points
                    </span>
                  </div>
                  
                  <button
                    onClick={handleMarkQuestion}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                      markedQuestions.includes(currentQuestion.id)
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400 hover:bg-yellow-500/20 hover:text-yellow-400'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    <span>{markedQuestions.includes(currentQuestion.id) ? 'Marked' : 'Mark'}</span>
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-6">
                  {currentQuestion.question}
                </h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border transition-all ${
                        answers[currentQuestion.id] === index
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                        }`}>
                          {answers[currentQuestion.id] === index && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-between">
                <NeonButton
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="secondary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </NeonButton>
                
                <div className="flex space-x-2">
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <NeonButton
                      onClick={() => setShowSubmitConfirm(true)}
                      variant="success"
                    >
                      Submit Exam
                    </NeonButton>
                  ) : (
                    <NeonButton
                      onClick={handleNext}
                      variant="primary"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </NeonButton>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <GlassCard hover={false}>
              <h4 className="text-lg font-semibold text-white mb-4">Questions</h4>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {exam.questions.map((question, index) => {
                  const status = getQuestionStatus(question.id, index);
                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-8 h-8 rounded-lg text-white text-sm font-medium ${getStatusColor(status)} hover:opacity-80`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-400">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-400">Marked ({markedQuestions.length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-600 rounded"></div>
                  <span className="text-gray-400">Unanswered ({totalQuestions - answeredCount})</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-sm text-gray-400 mb-2">Progress</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {Math.round((answeredCount / totalQuestions) * 100)}% Complete
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Submit Exam?</h3>
                <p className="text-gray-400">
                  You have answered {answeredCount} out of {totalQuestions} questions.
                  {answeredCount < totalQuestions && (
                    <span className="block mt-2 text-yellow-400">
                      {totalQuestions - answeredCount} questions remain unanswered.
                    </span>
                  )}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <NeonButton
                  onClick={() => setShowSubmitConfirm(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Continue
                </NeonButton>
                <NeonButton
                  onClick={handleSubmit}
                  variant="success"
                  className="flex-1"
                >
                  Submit
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};