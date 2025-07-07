import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { User } from '../../types';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';

export const PaymentReview: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    return JSON.parse(localStorage.getItem('examUsers') || '[]');
  });

  const updatePaymentStatus = (userId: string, status: 'approved' | 'rejected') => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            paymentStatus: status,
            status: status === 'approved' ? 'paid' : 'expired'
          } 
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('examUsers', JSON.stringify(updatedUsers));
  };

  const pendingPayments = users.filter(user => user.paymentStatus === 'pending');
  const approvedPayments = users.filter(user => user.paymentStatus === 'approved');
  const rejectedPayments = users.filter(user => user.paymentStatus === 'rejected');

  const PaymentCard: React.FC<{ user: User }> = ({ user }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white/5 border border-white/10 rounded-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-medium text-white">{user.name}</div>
          <div className="text-sm text-gray-400">{user.email}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            user.paymentStatus === 'pending' 
              ? 'text-yellow-400 bg-yellow-400/10'
              : user.paymentStatus === 'approved'
              ? 'text-green-400 bg-green-400/10'
              : 'text-red-400 bg-red-400/10'
          }`}>
            {user.paymentStatus}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {user.paymentReceipt && (
          <div className="text-sm">
            <span className="text-gray-400">Receipt:</span>
            <span className="text-white ml-2">{user.paymentReceipt}</span>
          </div>
        )}
        {user.paymentReference && (
          <div className="text-sm">
            <span className="text-gray-400">Reference:</span>
            <span className="text-white ml-2">{user.paymentReference}</span>
          </div>
        )}
      </div>

      {user.paymentStatus === 'pending' && (
        <div className="flex space-x-2">
          <NeonButton
            size="sm"
            variant="success"
            onClick={() => updatePaymentStatus(user.id, 'approved')}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </NeonButton>
          <NeonButton
            size="sm"
            variant="danger"
            onClick={() => updatePaymentStatus(user.id, 'rejected')}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </NeonButton>
        </div>
      )}
    </motion.div>
  );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Payment Review</h3>
        <p className="text-gray-400">Review and approve user payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard hover={false}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{pendingPayments.length}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{approvedPayments.length}</div>
              <div className="text-sm text-gray-400">Approved</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{rejectedPayments.length}</div>
              <div className="text-sm text-gray-400">Rejected</div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        {pendingPayments.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-400" />
              Pending Payments ({pendingPayments.length})
            </h4>
            <div className="space-y-3">
              {pendingPayments.map((user) => (
                <PaymentCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {approvedPayments.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Approved Payments ({approvedPayments.length})
            </h4>
            <div className="space-y-3">
              {approvedPayments.map((user) => (
                <PaymentCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {rejectedPayments.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <XCircle className="w-5 h-5 mr-2 text-red-400" />
              Rejected Payments ({rejectedPayments.length})
            </h4>
            <div className="space-y-3">
              {rejectedPayments.map((user) => (
                <PaymentCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {pendingPayments.length === 0 && approvedPayments.length === 0 && rejectedPayments.length === 0 && (
          <div className="text-center py-20">
            <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Payments</h3>
            <p className="text-gray-400">No payment requests to review</p>
          </div>
        )}
      </div>
    </div>
  );
};