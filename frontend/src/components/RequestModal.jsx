import React, { useState } from 'react';
import { X, Send, MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { requestService } from '../services/api';

const RequestModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [message, setMessage] = useState(
    'Hello! I am a student in need of this item. Would love to coordinate a pickup at your convenience.'
  );
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await requestService.createRequest({
        itemId: item._id,
        message,
        pickupTime
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1800);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit item request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 scale-100 transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-campus-secondary flex items-center justify-center text-campus-primary font-bold text-sm">
              ♻️
            </span>
            <h3 className="text-lg font-bold text-campus-text">Request This Item</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-campus-text">Request Sent Successfully!</h4>
            <p className="text-sm text-campus-textMuted max-w-sm mx-auto">
              The student donor ({item.donorName || 'Donor'}) has been notified. You can track this request under "My Requests".
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Item summary card */}
            <div className="flex items-center gap-3 p-3 bg-campus-bg rounded-xl border border-campus-border">
              <img
                src={item.image}
                alt={item.itemName}
                className="w-16 h-16 object-cover rounded-lg shrink-0"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-campus-primary uppercase tracking-wider">
                  {item.category}
                </p>
                <h4 className="text-sm font-bold text-campus-text truncate">{item.itemName}</h4>
                <div className="flex items-center gap-1 text-xs text-campus-textMuted mt-1">
                  <MapPin className="w-3 h-3 text-campus-primary" />
                  <span className="truncate">{item.pickupLocation}</span>
                </div>
              </div>
            </div>

            {/* Note to donor */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-campus-textMuted mb-1.5">
                Message to Donor *
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself and explain why you need this item..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary resize-none"
              />
            </div>

            {/* Proposed pickup time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-campus-textMuted mb-1.5">
                Preferred Pickup Time / Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="e.g. Tomorrow between 2 PM - 4 PM at Library"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-campus-primary hover:bg-campus-primaryDark text-white font-medium rounded-xl text-sm transition shadow-sm disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestModal;
