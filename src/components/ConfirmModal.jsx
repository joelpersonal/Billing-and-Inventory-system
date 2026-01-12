import { HiOutlineExclamationTriangle, HiOutlineXMark } from 'react-icons/hi2';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // warning, danger
}) {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          confirmButton: 'bg-red-500 hover:bg-red-600',
          cancelButton: 'bg-gray-500 hover:bg-gray-600',
          title: 'text-red-800',
          message: 'text-red-700',
          icon: 'text-red-500'
        };
      case 'warning':
      default:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600',
          cancelButton: 'bg-gray-500 hover:bg-gray-600',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          icon: 'text-yellow-500'
        };
    }
  };

  const colors = getColors();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${colors.border} border-2`}>
        {/* Header */}
        <div className={`${colors.bg} px-6 py-4 rounded-t-2xl border-b ${colors.border} flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <HiOutlineExclamationTriangle className={`w-8 h-8 ${colors.icon}`} />
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
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl text-white font-semibold transition-colors ${colors.cancelButton}`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-2 rounded-xl text-white font-semibold transition-colors ${colors.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}