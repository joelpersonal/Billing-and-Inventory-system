import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  HiOutlineCurrencyRupee,
  HiOutlineCalendarDays,
  HiOutlineTrophy,
  HiOutlineChartBarSquare,
  HiOutlineExclamationTriangle,
  HiOutlineSparkles,
  HiOutlineXMark
} from 'react-icons/hi2';

export default function SmartInvoiceInsights({ insights, onClose, isVisible }) {
  const { formatCurrency } = useSettings();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isVisible) {
      setAnimationClass('animate-slideInUp');
    }
  }, [isVisible]);

  if (!insights || !isVisible) return null;

  const insightCards = [
    {
      icon: HiOutlineCurrencyRupee,
      title: 'Profit Analysis',
      message: insights.profit?.message || 'Profit calculation unavailable',
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-600',
      show: insights.profit?.amount > 0
    },
    {
      icon: HiOutlineCalendarDays,
      title: 'Customer Pattern',
      message: insights.customerPattern?.message || 'Customer pattern unavailable',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-600',
      show: true
    },
    {
      icon: HiOutlineTrophy,
      title: 'Top Selling Item',
      message: insights.topSellingItem?.message || 'Top selling item unavailable',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-600',
      show: insights.topSellingItem?.quantity > 0
    },
    {
      icon: HiOutlineChartBarSquare,
      title: 'Sales Comparison',
      message: insights.salesComparison?.message || 'Sales comparison unavailable',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      iconColor: 'text-purple-600',
      show: true
    },
    {
      icon: HiOutlineExclamationTriangle,
      title: 'Stock Alert',
      message: insights.stockAlert?.message || 'No stock alerts',
      color: insights.stockAlert?.hasAlerts ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-200 text-gray-800',
      iconColor: insights.stockAlert?.hasAlerts ? 'text-red-600' : 'text-gray-600',
      show: true
    },
    {
      icon: HiOutlineSparkles,
      title: 'Revenue Impact',
      message: insights.revenueImpact?.message || 'Revenue impact unavailable',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      iconColor: 'text-indigo-600',
      show: insights.revenueImpact?.percentage > 0
    }
  ];

  const visibleCards = insightCards.filter(card => card.show);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${animationClass}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <HiOutlineSparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Smart Invoice Insights</h2>
                <p className="text-purple-100 text-sm">AI-powered business intelligence for your sale</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={index}
                  className={`${card.color} border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${card.iconColor} bg-white bg-opacity-50 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
                      <p className="text-sm leading-relaxed">{card.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-medium"
            >
              Got it! 🚀
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              💡 These insights are generated in real-time based on your sales data and customer patterns
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.4s ease-out;
        }

        .animate-pulse-gentle {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}