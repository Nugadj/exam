import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, DollarSign, TrendingUp, Clock, Award } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const AdminStats: React.FC = () => {
  // Mock data
  const users = JSON.parse(localStorage.getItem('examUsers') || '[]');
  const studentUsers = users.filter((user: any) => user.role === 'student');
  
  const stats = [
    {
      title: 'Total Users',
      value: studentUsers.length,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Active Trials',
      value: studentUsers.filter((u: any) => u.status === 'trial').length,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      change: '+8%'
    },
    {
      title: 'Paid Users',
      value: studentUsers.filter((u: any) => u.status === 'paid').length,
      icon: Award,
      color: 'from-green-500 to-teal-500',
      change: '+25%'
    },
    {
      title: 'Revenue',
      value: `$${studentUsers.filter((u: any) => u.status === 'paid').length * 99}`,
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      change: '+18%'
    }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Completed Math Exam', time: '2 hours ago', score: 85 },
    { user: 'Jane Smith', action: 'Started Physics Practice', time: '3 hours ago', score: null },
    { user: 'Bob Johnson', action: 'Upgraded to Premium', time: '1 day ago', score: null },
    { user: 'Alice Brown', action: 'Completed CS Exam', time: '1 day ago', score: 92 }
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h3>
        <p className="text-gray-400">Platform statistics and recent activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <GlassCard hover={false}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.title}</div>
                  <div className="text-xs text-green-400 mt-1">{stat.change}</div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Status Distribution */}
        <GlassCard hover={false}>
          <h4 className="text-lg font-semibold text-white mb-4">User Status</h4>
          <div className="space-y-3">
            {[
              { label: 'Trial Users', count: studentUsers.filter((u: any) => u.status === 'trial').length, color: 'yellow' },
              { label: 'Paid Users', count: studentUsers.filter((u: any) => u.status === 'paid').length, color: 'green' },
              { label: 'Expired Users', count: studentUsers.filter((u: any) => u.status === 'expired').length, color: 'red' }
            ].map((item, index) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  <span className="text-gray-300">{item.label}</span>
                </div>
                <span className="text-white font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard hover={false}>
          <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{activity.user}</div>
                  <div className="text-sm text-gray-400">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
                {activity.score && (
                  <div className="text-green-400 font-bold">{activity.score}%</div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};