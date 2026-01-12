import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import {
  HiOutlineXMark,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle
} from 'react-icons/hi2';

export default function InvoiceTimeline({ 
  isVisible, 
  onClose, 
  orderNumber, 
  orderId 
}) {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isVisible && (orderNumber || orderId)) {
      fetchTimeline();
    }
  }, [isVisible, orderNumber, orderId]);

  const fetchTimeline = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (orderId) {
        response = await apiService.getInvoiceTimeline(orderId);
      } else if (orderNumber) {
        response = await apiService.getTimelineByOrderNumber(orderNumber);
      }
      
      setTimeline(response.data);
    } catch (err) {
      console.error('Error fetching timeline:', err);
      setError(err.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  const getEventStyling = (eventType) => {
    const styles = {
      'bill_created': { color: 'text-green-600', bgColor: 'bg-green-50', icon: '🟢', label: 'Created' },
      'discount_applied': { color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: '🟡', label: 'Discount' },
      'inventory_updated': { color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '🔵', label: 'Inventory' },
      'payment_received': { color: 'text-purple-600', bgColor: 'bg-purple-50', icon: '🟣', label: 'Payment' },
      'email_sent': { color: 'text-indigo-600', bgColor: 'bg-indigo-50', icon: '📧', label: 'Email' },
      'pdf_generated': { color: 'text-gray-600', bgColor: 'bg-gray-50', icon: '📄', label: 'PDF' },
      'status_changed': { color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '🔄', label: 'Status' },
      'customer_updated': { color: 'text-teal-600', bgColor: 'bg-teal-50', icon: '👤', label: 'Customer' }
    };

    return styles[eventType] || { color: 'text-gray-600', bgColor: 'bg-gray-50', icon: '⚪', label: 'Event' };
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Invoice Timeline</h2>
              <p className="text-purple-100 mt-1">
                {timeline?.order?.orderNumber || orderNumber || 'Loading...'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>
          </div>
          
          {timeline?.order && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-purple-200">Customer:</span>
                <p className="font-medium">{timeline.order.customerName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-purple-200">Total:</span>
                <p className="font-medium">${timeline.order.totalAmount?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading timeline...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12 text-red-600">
              <HiOutlineExclamationCircle className="w-6 h-6 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {timeline && timeline.timeline && (
            <div className="space-y-4">
              <div className="text-sm text-gray-500 mb-6">
                Audit-grade billing timeline • {timeline.timeline.events?.length || 0} events
              </div>

              {timeline.timeline.events?.map((event, index) => {
                const styling = getEventStyling(event.eventType);
                const isLast = index === timeline.timeline.events.length - 1;

                return (
                  <div key={index} className="relative">
                    {/* Timeline line */}
                    {!isLast && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}

                    {/* Event card */}
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styling.bgColor} flex items-center justify-center text-lg`}>
                        {styling.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-medium ${styling.color}`}>
                              {event.description}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <HiOutlineClock className="w-4 h-4 mr-1" />
                              {formatTime(event.timestamp)}
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            {formatDate(event.timestamp)}
                          </div>

                          {/* Event details */}
                          {event.details && Object.keys(event.details).length > 0 && (
                            <div className="mt-3 p-3 bg-white rounded border text-sm">
                              {event.eventType === 'discount_applied' && event.details.discountAmount && (
                                <p>Amount: ${event.details.discountAmount} ({event.details.discountType})</p>
                              )}
                              {event.eventType === 'payment_received' && event.details.paymentMethod && (
                                <p>Method: {event.details.paymentMethod} • Amount: ${event.details.amount}</p>
                              )}
                              {event.eventType === 'email_sent' && event.details.recipientEmail && (
                                <p>Sent to: {event.details.recipientEmail}</p>
                              )}
                              {event.eventType === 'status_changed' && event.details.oldStatus && (
                                <p>Changed from "{event.details.oldStatus}" to "{event.details.newStatus}"</p>
                              )}
                              {event.eventType === 'inventory_updated' && event.details.productUpdates && (
                                <p>Updated {event.details.productUpdates.length} product(s)</p>
                              )}
                            </div>
                          )}

                          {/* User info */}
                          {event.userId && (
                            <div className="mt-2 text-xs text-gray-500">
                              by {event.userId.name || event.userId.email || 'System'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {(!timeline.timeline.events || timeline.timeline.events.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  <HiOutlineClock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No timeline events found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <HiOutlineCheckCircle className="w-4 h-4 mr-1 text-green-500" />
              Audit-grade billing
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}