import React from 'react';
import { User, LogOut, Clock, CreditCard } from 'lucide-react';

interface HeaderProps {
  userPlan: string | null;
  onLogout: () => void;
  onShowPayment: () => void;
  trialDaysLeft?: number;
}

export default function Header({ userPlan, onLogout, onShowPayment, trialDaysLeft = 7 }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">StudyApp</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Trial Timer - Only show if no plan */}
            {!userPlan && (
              <div className="flex items-center bg-orange-50 text-orange-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-orange-200">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Trial: </span>
                <span>{trialDaysLeft} days left</span>
              </div>
            )}

            {/* Upgrade Button - Only show if no plan */}
            {!userPlan && (
              <button
                onClick={onShowPayment}
                className="flex items-center bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-xs sm:text-sm min-h-[44px] touch-manipulation"
              >
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Upgrade to Pro</span>
                <span className="sm:hidden">Upgrade</span>
              </button>
            )}

            {/* Pro Status - Only show if has plan */}
            {userPlan && (
              <div className="flex items-center bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-green-200">
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Pro Member
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm min-h-[44px] touch-manipulation"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
