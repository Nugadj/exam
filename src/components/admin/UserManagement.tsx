import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Crown, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { User } from '../../types';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    return JSON.parse(localStorage.getItem('examUsers') || '[]');
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('examUsers', JSON.stringify(updatedUsers));
    
    // Update selected user if it's the one being updated
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, ...updates });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trial': return 'text-yellow-400 bg-yellow-400/10';
      case 'paid': return 'text-green-400 bg-green-400/10';
      case 'expired': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const studentUsers = users.filter(user => user.role === 'student');

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">User Management</h3>
        <p className="text-gray-400">Manage user accounts and permissions</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Users List */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            All Users ({studentUsers.length})
          </h4>
          <div className="space-y-3">
            {studentUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    {user.paymentStatus !== 'none' && (
                      <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(user.paymentStatus)}`}>
                        {user.paymentStatus}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* User Details */}
        <div>
          {selectedUser ? (
            <GlassCard hover={false}>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">User Details</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{selectedUser.name}</div>
                    <div className="text-sm text-gray-400">{selectedUser.email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <div className="flex space-x-2">
                    <NeonButton
                      size="sm"
                      variant={selectedUser.status === 'trial' ? 'primary' : 'secondary'}
                      onClick={() => updateUser(selectedUser.id, { status: 'trial' })}
                    >
                      Trial
                    </NeonButton>
                    <NeonButton
                      size="sm"
                      variant={selectedUser.status === 'paid' ? 'success' : 'secondary'}
                      onClick={() => updateUser(selectedUser.id, { status: 'paid' })}
                    >
                      Paid
                    </NeonButton>
                    <NeonButton
                      size="sm"
                      variant={selectedUser.status === 'expired' ? 'danger' : 'secondary'}
                      onClick={() => updateUser(selectedUser.id, { status: 'expired' })}
                    >
                      Expired
                    </NeonButton>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
                  <div className="flex space-x-2">
                    <NeonButton
                      size="sm"
                      variant={selectedUser.paymentStatus === 'approved' ? 'success' : 'secondary'}
                      onClick={() => updateUser(selectedUser.id, { paymentStatus: 'approved', status: 'paid' })}
                    >
                      Approve
                    </NeonButton>
                    <NeonButton
                      size="sm"
                      variant={selectedUser.paymentStatus === 'rejected' ? 'danger' : 'secondary'}
                      onClick={() => updateUser(selectedUser.id, { paymentStatus: 'rejected' })}
                    >
                      Reject
                    </NeonButton>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Join Date:</span>
                      <div className="text-white">{new Date(selectedUser.joinDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Active:</span>
                      <div className="text-white">{new Date(selectedUser.lastActive).toLocaleDateString()}</div>
                    </div>
                    {selectedUser.trialEndDate && (
                      <div>
                        <span className="text-gray-400">Trial Ends:</span>
                        <div className="text-white">{new Date(selectedUser.trialEndDate).toLocaleDateString()}</div>
                      </div>
                    )}
                    {selectedUser.paymentReference && (
                      <div>
                        <span className="text-gray-400">Payment Ref:</span>
                        <div className="text-white">{selectedUser.paymentReference}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="text-center py-20">
              <UserIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Select a User</h3>
              <p className="text-gray-400">Choose a user from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};