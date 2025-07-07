import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { HolographicText } from '../ui/HolographicText';
import { NeonButton } from '../ui/NeonButton';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trial': return 'text-yellow-400';
      case 'paid': return 'text-green-400';
      case 'expired': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrialTimeRemaining = () => {
    if (user.status !== 'trial' || !user.trialEndDate) return null;
    
    const now = new Date();
    const end = new Date(user.trialEndDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Trial Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="backdrop-blur-lg bg-black/20 border-b border-white/10 px-6 py-4"
      style={{ pointerEvents: 'auto', zIndex: 50 }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <HolographicText variant="h3" className="!text-2xl">
          ExamAI 2050
        </HolographicText>
        
        <div className="flex items-center space-x-6">
          {user.status === 'trial' && (
            <div className="text-sm text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
              {getTrialTimeRemaining()}
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {user.role === 'admin' && <Crown className="w-5 h-5 text-yellow-400" />}
              <User className="w-5 h-5 text-gray-400" />
              <div className="text-sm">
                <div className="text-white font-medium">{user.name}</div>
                <div className={`text-xs ${getStatusColor(user.status)} capitalize`}>
                  {user.status}
                </div>
              </div>
            </div>
            
            <NeonButton
              onClick={handleLogout}
              variant="danger"
              size="sm"
              className="!px-3 !py-2"
            >
              <LogOut className="w-4 h-4" />
            </NeonButton>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
