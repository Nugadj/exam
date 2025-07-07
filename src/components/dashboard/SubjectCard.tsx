import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Target, Clock } from 'lucide-react';
import { Subject } from '../../types';
import { useExam } from '../../contexts/ExamContext';
import { GlassCard } from '../ui/GlassCard';
import { ProgressBar } from '../ui/ProgressBar';
import { NeonButton } from '../ui/NeonButton';

interface SubjectCardProps {
  subject: Subject;
  onStartPractice: (subject: Subject) => void;
  onTakeExam: (subject: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onStartPractice, onTakeExam }) => {
  const { getSubjectProgress, exams } = useExam();
  const progress = getSubjectProgress(subject.id);
  const subjectExams = exams.filter(exam => exam.subject.id === subject.id);

  return (
    <GlassCard className="h-full">
      <div className="flex flex-col h-full">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-4`}>
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{subject.name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-grow">{subject.description}</p>
        
        <div className="mb-4">
          <ProgressBar progress={progress} color="blue" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-400">
            <Target className="w-4 h-4 mr-2" />
            {subject.topics.length} Topics
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            {subjectExams.length} Exams Available
          </div>
        </div>

        <div className="flex space-x-2">
          <NeonButton
            onClick={() => onStartPractice(subject)}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            Practice
          </NeonButton>
          <NeonButton
            onClick={() => onTakeExam(subject)}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            Exam
          </NeonButton>
        </div>
      </div>
    </GlassCard>
  );
};