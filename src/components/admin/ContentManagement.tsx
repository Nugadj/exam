import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { Question, Subject } from '../../types';
import { useExam } from '../../contexts/ExamContext';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { v4 as uuidv4 } from 'uuid';

export const ContentManagement: React.FC = () => {
  const { questions, subjects, addQuestion, updateQuestion, deleteQuestion } = useExam();
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const difficulties = ['easy', 'medium', 'hard'];

  const handleAddQuestion = () => {
    setShowAddQuestion(true);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowAddQuestion(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(questionId);
    }
  };

  const QuestionForm: React.FC = () => {
    const [formData, setFormData] = useState({
      subject: editingQuestion?.subject.id || '',
      topic: editingQuestion?.topic || '',
      difficulty: editingQuestion?.difficulty || 'medium',
      question: editingQuestion?.question || '',
      options: editingQuestion?.options || ['', '', '', ''],
      correctAnswer: editingQuestion?.correctAnswer || 0,
      explanation: editingQuestion?.explanation || '',
      points: editingQuestion?.points || 10
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const subject = subjects.find(s => s.id === formData.subject);
      if (!subject) return;

      const questionData: Question = {
        id: editingQuestion?.id || uuidv4(),
        subject: subject,
        topic: formData.topic,
        difficulty: formData.difficulty as 'easy' | 'medium' | 'hard',
        question: formData.question,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation,
        points: formData.points
      };

      if (editingQuestion) {
        updateQuestion(editingQuestion.id, questionData);
      } else {
        addQuestion(questionData);
      }

      setShowAddQuestion(false);
      setEditingQuestion(null);
    };

    return (
      <GlassCard hover={false}>
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-2">
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id} className="bg-gray-800">
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Topic</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter topic"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="bg-gray-800 capitalize">
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Question</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              rows={3}
              placeholder="Enter question"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Options</label>
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === index}
                    onChange={() => setFormData({ ...formData, correctAnswer: index })}
                    className="text-blue-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index] = e.target.value;
                      setFormData({ ...formData, options: newOptions });
                    }}
                    className="flex-1 p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Explanation</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              rows={2}
              placeholder="Enter explanation"
              required
            />
          </div>

          <div className="flex space-x-2">
            <NeonButton type="submit" variant="success">
              {editingQuestion ? 'Update Question' : 'Add Question'}
            </NeonButton>
            <NeonButton
              type="button"
              variant="secondary"
              onClick={() => setShowAddQuestion(false)}
            >
              Cancel
            </NeonButton>
          </div>
        </form>
      </GlassCard>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Content Management</h3>
            <p className="text-gray-400">Manage questions and exam content</p>
          </div>
          <NeonButton onClick={handleAddQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </NeonButton>
        </div>
      </div>

      {showAddQuestion && <QuestionForm />}

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          Questions ({questions.length})
        </h4>
        
        {questions.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Questions</h3>
            <p className="text-gray-400">Start by adding your first question</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {question.subject.name}
                      </span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        {question.topic}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {question.points} pts
                      </span>
                    </div>
                    <div className="text-white font-medium mb-2">{question.question}</div>
                    <div className="text-sm text-gray-400">
                      Correct: {question.options[question.correctAnswer]}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};