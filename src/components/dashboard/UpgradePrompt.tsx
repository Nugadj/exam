import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Upload, CreditCard, Check, Clock, DollarSign, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { HolographicText } from '../ui/HolographicText';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';

export const UpgradePrompt: React.FC = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'receipt' | 'reference'>('receipt');
  const [paymentData, setPaymentData] = useState({
    receipt: null as File | null,
    reference: ''
  });
  const { user, updateUser } = useAuth();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentData({ ...paymentData, receipt: file });
    }
  };

  const handleSubmitPayment = () => {
    if (!user) return;

    if (paymentType === 'receipt' && paymentData.receipt) {
      updateUser({
        paymentStatus: 'pending',
        paymentReceipt: paymentData.receipt.name
      });
    } else if (paymentType === 'reference' && paymentData.reference) {
      updateUser({
        paymentStatus: 'pending',
        paymentReference: paymentData.reference
      });
    }

    alert('Payment submitted for review! You will receive access once approved by admin.');
  };

  const features = [
    'Access to all 3 subjects',
    'Unlimited practice questions',
    '20 timed mock exams per subject',
    'Detailed solutions & explanations',
    'Progress tracking & analytics',
    'AI study assistant',
    'Certificate of completion'
  ];

  const bankAccounts = [
    { bank: 'Commercial Bank of Ethiopia', account: '1000123456789', name: 'ExamAI Education' },
    { bank: 'Awash Bank', account: '0123456789012', name: 'ExamAI Education' },
    { bank: 'Dashen Bank', account: '9876543210123', name: 'ExamAI Education' }
  ];

  if (user?.paymentStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <GlassCard hover={false} className="max-w-md text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <HolographicText variant="h3" className="mb-2">
                Payment Under Review
              </HolographicText>
              <p className="text-gray-400">
                Your payment is being reviewed by our admin team. You'll receive access once approved.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
              <p className="text-yellow-400 text-sm">
                <strong>Status:</strong> Pending Approval
              </p>
              <p className="text-yellow-400 text-sm mt-1">
                This usually takes 24-48 hours
              </p>
            </div>

            <div className="text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Submitted:</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
              {user.paymentReceipt && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Receipt:</span>
                  <span className="text-white">{user.paymentReceipt}</span>
                </div>
              )}
              {user.paymentReference && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Reference:</span>
                  <span className="text-white">{user.paymentReference}</span>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Crown className="w-10 h-10 text-white" />
          </motion.div>
          
          <HolographicText variant="h1" className="mb-4">
            Upgrade to Premium
          </HolographicText>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {user?.status === 'expired' 
              ? 'Your trial has expired. Upgrade to premium to continue your learning journey.'
              : 'Unlock unlimited access to all features and content.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard hover={false}>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">$99</div>
                <div className="text-gray-400">One-time payment</div>
                <div className="text-sm text-green-400 mt-1">Lifetime access</div>
              </div>

              <div className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <NeonButton
                onClick={() => setShowPayment(true)}
                variant="success"
                className="w-full"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Upgrade Now
              </NeonButton>
            </GlassCard>
          </motion.div>

          {showPayment && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard hover={false}>
                <h3 className="text-xl font-bold text-white mb-4">Payment Instructions</h3>
                
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-3 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Step 1: Make Payment ($99)
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">Send payment to any of these bank accounts:</p>
                  <div className="space-y-3">
                    {bankAccounts.map((account, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="text-white font-medium">{account.bank}</div>
                        <div className="text-sm text-gray-400">Account: {account.account}</div>
                        <div className="text-sm text-gray-400">Name: {account.name}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-yellow-500/10 rounded text-xs text-yellow-400">
                    <strong>Note:</strong> Please include your email ({user?.email}) in the payment description
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Step 2: Submit Proof of Payment
                  </h4>
                  
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={() => setPaymentType('receipt')}
                      className={`flex-1 p-3 rounded-lg border ${
                        paymentType === 'receipt' 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                          : 'border-white/20 bg-white/5 text-gray-400'
                      }`}
                    >
                      <Upload className="w-5 h-5 mx-auto mb-1" />
                      Upload Receipt
                    </button>
                    <button
                      onClick={() => setPaymentType('reference')}
                      className={`flex-1 p-3 rounded-lg border ${
                        paymentType === 'reference' 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                          : 'border-white/20 bg-white/5 text-gray-400'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1" />
                      Reference Number
                    </button>
                  </div>

                  {paymentType === 'receipt' ? (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Upload payment receipt (image file)
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white file:bg-blue-500 file:border-0 file:text-white file:px-4 file:py-2 file:rounded-md file:mr-4"
                      />
                      {paymentData.receipt && (
                        <p className="text-green-400 text-sm mt-2">
                          ✓ File selected: {paymentData.receipt.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Enter transaction reference number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., TXN123456789"
                        value={paymentData.reference}
                        onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>

                <NeonButton
                  onClick={handleSubmitPayment}
                  disabled={
                    (paymentType === 'receipt' && !paymentData.receipt) ||
                    (paymentType === 'reference' && !paymentData.reference)
                  }
                  className="w-full"
                >
                  Submit for Review
                </NeonButton>

                <div className="mt-4 p-3 bg-gray-500/10 border border-gray-500/30 rounded-lg text-sm text-gray-400">
                  <p><strong>Review Process:</strong></p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Payment verification: 2-6 hours</li>
                    <li>• Account activation: Immediate after approval</li>
                    <li>• Email notification when approved</li>
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};