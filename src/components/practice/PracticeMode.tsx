import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Subject, Question } from '../../types';
import { useExam } from '../../contexts/ExamContext';
import { HolographicText } from '../ui/HolographicText';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';

interface PracticeModeProps {
  subject: Subject;
  onBack: () => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({ subject, onBack }) => {
  const { questions } = useExam();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const subjectQuestions = questions.filter(q => q.subject.id === subject.id);
  const currentQuestion = subjectQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <GlassCard hover={false} className="text-center">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Practice Questions</h3>
          <p className="text-gray-400 mb-4">Practice questions for this subject are coming soon!</p>
          <NeonButton onClick={onBack}>Back to Dashboard</NeonButton>
        </GlassCard>
      </div>
    );
  }

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
  };

  const handleNext = () => {
    if (currentQuestionIndex < subjectQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
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
                {subject.name} Practice
              </HolographicText>
              <p className="text-gray-400">
                Question {currentQuestionIndex + 1} of {subjectQuestions.length}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <GlassCard hover={false}>
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
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
                
                <h3 className="text-xl font-semibold text-white mb-6">
                  {currentQuestion.question}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 text-left rounded-lg border transition-all ${
                        showExplanation
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-500/20 text-green-400'
                            : selectedAnswer === index && index !== currentQuestion.correctAnswer
                            ? 'border-red-500 bg-red-500/20 text-red-400'
                            : 'border-white/20 bg-white/5 text-gray-300'
                          : selectedAnswer === index
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/10'
                      }`}
                      whileHover={!showExplanation ? { scale: 1.02 } : {}}
                      whileTap={!showExplanation ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          showExplanation
                            ? index === currentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-500'
                              : selectedAnswer === index && index !== currentQuestion.correctAnswer
                              ? 'border-red-500 bg-red-500'
                              : 'border-gray-400'
                            : selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                        }`}>
                          {showExplanation && index === currentQuestion.correctAnswer && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                          {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                          {!showExplanation && selectedAnswer === index && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${
                      isCorrect 
                        ? 'border-green-500/30 bg-green-500/10' 
                        : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className={`w-5 h-5 ${isCorrect ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-gray-300">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
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
                  {!showExplanation && selectedAnswer !== null && (
                    <NeonButton
                      onClick={handleSubmitAnswer}
                      variant="success"
                    >
                      Submit Answer
                    </NeonButton>
                  )}
                  
                  {showExplanation && currentQuestionIndex < subjectQuestions.length - 1 && (
                    <NeonButton
                      onClick={handleNext}
                      variant="primary"
                    >
                      Next Question
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </NeonButton>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Progress Panel */}
          <div className="lg:col-span-1">
            <GlassCard hover={false}>
              <h4 className="text-lg font-semibold text-white mb-4">Progress</h4>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Completed</span>
                  <span className="text-white text-sm">
                    {answeredQuestions.size}/{subjectQuestions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${(answeredQuestions.size / subjectQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current Topic:</span>
                  <span className="text-white">{currentQuestion.topic}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className={`capitalize ${
                    currentQuestion.difficulty === 'easy' ? 'text-green-400' :
                    currentQuestion.difficulty === 'medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Points:</span>
                  <span className="text-white">{currentQuestion.points}</span>
                </div>
              </div>

              {answeredQuestions.size > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h5 className="text-white font-medium mb-2">Quick Stats</h5>
                  <div className="text-sm text-gray-400">
                    <div>Questions practiced: {answeredQuestions.size}</div>
                    <div>Progress: {Math.round((answeredQuestions.size / subjectQuestions.length) * 100)}%</div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};