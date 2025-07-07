import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, DollarSign, Settings, Eye, GraduationCap, FileText } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { PracticeContentManagement } from './PracticeContentManagement';
import { ExamContentManagement } from './ExamContentManagement';
import { PaymentReview } from './PaymentReview';
import { AdminStats } from './AdminStats';
import { HolographicText } from '../ui/HolographicText';

type AdminTab = 'stats' | 'users' | 'practice-content' | 'exam-content' | 'payments' | 'settings';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: Eye },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'practice-content', label: 'Practice Questions', icon: BookOpen },
    { id: 'exam-content', label: 'Exam Questions', icon: GraduationCap },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <AdminStats />;
      case 'users':
        return <UserManagement />;
      case 'practice-content':
        return <PracticeContentManagement />;
      case 'exam-content':
        return <ExamContentManagement />;
      case 'payments':
        return <PaymentReview />;
      case 'settings':
        return (
          <div className="text-center py-20">
            <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Settings</h3>
            <p className="text-gray-400">Admin settings coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <HolographicText variant="h2" className="mb-2">
              Admin Panel
            </HolographicText>
            <p className="text-gray-400">
              Manage users, content, and platform settings
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-4">
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as AdminTab)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1"
            >
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 min-h-[600px]">
                {renderContent()}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};