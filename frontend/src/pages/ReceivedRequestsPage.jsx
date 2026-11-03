import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Check,
  X,
  CheckCircle2,
  Calendar,
  User,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { requestService } from '../services/api';
import { RequestStatusBadge } from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

const ReceivedRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal actions
  const [activeModal, setActiveModal] = useState({
    isOpen: false,
    requestId: null,
    targetStatus: null,
    itemTitle: '',
    requesterName: ''
  });
  const [donorNote, setDonorNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReceivedRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getReceivedRequests();
      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load received requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const handleOpenActionModal = (req, targetStatus) => {
    setActiveModal({
      isOpen: true,
      requestId: req._id,
      targetStatus,
      itemTitle: req.item?.itemName || 'Item',
      requesterName: req.requester?.name || 'Student'
    });
    setDonorNote('');
  };

  const handleConfirmAction = async () => {
    if (!activeModal.requestId || !activeModal.targetStatus) return;

    try {
      setActionLoading(true);
      await requestService.updateRequestStatus(activeModal.requestId, {
        status: activeModal.targetStatus,
        donorNote: donorNote || undefined
      });
      setActiveModal({ isOpen: false, requestId: null, targetStatus: null, itemTitle: '', requesterName: '' });
      fetchReceivedRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge-eco">Peer Requests</span>
          <h1 className="text-3xl font-extrabold text-campus-text tracking-tight">
            Incoming Item Requests
          </h1>
          <p className="text-sm text-campus-textMuted">
            Review and respond to classmates who requested items you donated.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-campus-border shadow-subtle self-start">
          {['All', 'Pending', 'Accepted', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                filter === tab
                  ? 'bg-campus-primary text-white shadow-sm'
                  : 'text-campus-textMuted hover:text-campus-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="campus-card h-40 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No incoming requests"
          description={
            filter === 'All'
              ? 'You have not received any requests yet. Share more items to connect with peers!'
              : `No requests with status "${filter}".`
          }
          actionText="View My Donated Items"
          actionLink="/my-donations"
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="campus-card p-5 sm:p-6 bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              {/* Item Thumbnail & Details */}
              <div className="flex items-start gap-4">
                <img
                  src={req.item?.image}
                  alt={req.item?.itemName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-gray-100"
                />
                <div className="space-y-1.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-campus-primary">
                      {req.item?.category}
                    </span>
                    <RequestStatusBadge status={req.status} />
                  </div>

                  <Link to={`/items/${req.item?._id}`}>
                    <h3 className="font-extrabold text-base sm:text-lg text-campus-text hover:text-campus-primary transition">
                      {req.item?.itemName}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-campus-textMuted">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-campus-primary" />
                      <span className="font-bold text-campus-text">{req.requester?.name}</span>
                      <span>
                        ({req.requester?.department} • {req.requester?.year})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(req.requestedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Requester Message */}
                  {req.message && (
                    <div className="p-2.5 bg-campus-bg rounded-xl border border-campus-border text-xs text-campus-text flex items-start gap-2 max-w-xl">
                      <MessageSquare className="w-3.5 h-3.5 text-campus-primary shrink-0 mt-0.5" />
                      <span className="italic">"{req.message}"</span>
                    </div>
                  )}

                  {/* Proposed pickup */}
                  {req.pickupTime && (
                    <p className="text-xs text-campus-primaryDark font-medium">
                      🕒 Proposed meetup: <span className="font-bold">{req.pickupTime}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-end lg:self-center shrink-0">
                {req.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleOpenActionModal(req, 'Accepted')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-campus-primary hover:bg-campus-primaryDark text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Request</span>
                    </button>

                    <button
                      onClick={() => handleOpenActionModal(req, 'Rejected')}
                      className="inline-flex items-center gap-1 px-3 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </>
                )}

                {req.status === 'Accepted' && (
                  <button
                    onClick={() => handleOpenActionModal(req, 'Completed')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Handover Completed</span>
                  </button>
                )}

                {req.status === 'Completed' && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">
                    Exchange Completed ♻️
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Confirmation Modal */}
      {activeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-campus-text">
              {activeModal.targetStatus === 'Accepted'
                ? 'Accept Item Request'
                : activeModal.targetStatus === 'Completed'
                ? 'Mark Handover Completed'
                : 'Decline Item Request'}
            </h3>

            <p className="text-xs text-campus-textMuted leading-relaxed">
              {activeModal.targetStatus === 'Accepted' &&
                `Accepting will reserve "${activeModal.itemTitle}" for ${activeModal.requesterName}. Other pending requests for this item will be automatically updated.`}
              {activeModal.targetStatus === 'Completed' &&
                `Confirm that you have successfully met ${activeModal.requesterName} and handed over the item.`}
              {activeModal.targetStatus === 'Rejected' &&
                `Are you sure you want to decline this request from ${activeModal.requesterName}?`}
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-textMuted mb-1">
                Note for Requester (Optional)
              </label>
              <textarea
                rows={2}
                value={donorNote}
                onChange={(e) => setDonorNote(e.target.value)}
                placeholder="e.g. Let us meet in the Library lobby at 3 PM."
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  setActiveModal({
                    isOpen: false,
                    requestId: null,
                    targetStatus: null,
                    itemTitle: '',
                    requesterName: ''
                  })
                }
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmAction}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl transition ${
                  activeModal.targetStatus === 'Rejected'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-campus-primary hover:bg-campus-primaryDark'
                }`}
              >
                {actionLoading ? 'Updating...' : `Confirm ${activeModal.targetStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedRequestsPage;
