import { useEffect } from 'react';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineInformationCircle, HiOutlineExclamationTriangle, HiOutlineXMark } from 'react-icons/hi2';

export default function CustomModal({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  autoClose = true,
  autoCloseDelay = 3000 
}) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <HiOutlineCheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <HiOutlineXCircle className="w-12 h-12 text-red-500" />;
      case 'warning':
        return <HiOutlineExclamationTriangle className="w-12 h-12 text-yellow-500" />;
      case 'info':
      default:
        return <HiOutlineInformationCircle className="w-12 h-12 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          button: 'bg-green-500 hover:bg-green-600',
          title: 'text-green-800',
          message: 'text-green-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          button: 'bg-red-500 hover:bg-red-600',
          title: 'text-red-800',
          message: 'text-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          button: 'bg-yellow-500 hover:bg-yellow-600',
          title: 'text-yellow-800',
          message: 'text-yellow-700'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'bg-blue-500 hover:bg-blue-600',
          title: 'text-blue-800',
          message: 'text-blue-700'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${colors.border} border-2`}>
        {/* Header */}
        <div className={`${colors.bg} px-6 py-4 rounded-t-2xl border-b ${colors.border} flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className={`text-lg font-bold ${colors.title}`}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiOutlineXMark size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className={`text-sm ${colors.message} leading-relaxed`}>
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl text-white font-semibold transition-colors ${colors.button}`}
          >
            OK
          </button>
        </div>

        {/* Auto-close progress bar */}
        {autoClose && (
          <div className="h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
            <div 
              className={`h-full ${colors.button.split(' ')[0]} transition-all duration-${autoCloseDelay} ease-linear`}
              style={{
                animation: `shrink ${autoCloseDelay}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}