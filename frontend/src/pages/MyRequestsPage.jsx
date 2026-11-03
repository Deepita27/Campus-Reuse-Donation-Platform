import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { requestService } from '../services/api';
import { RequestStatusBadge } from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for cancel or complete confirmation
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    requestId: null,
    targetStatus: null,
    title: '',
    message: '',
    isDanger: false
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getMyRequests();
      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleOpenConfirm = (requestId, targetStatus, itemName) => {
    if (targetStatus === 'Cancelled') {
      setConfirmModal({
        isOpen: true,
        requestId,
        targetStatus: 'Cancelled',
        title: 'Cancel Item Request?',
        message: `Are you sure you want to cancel your request for "${itemName}"?`,
        isDanger: true
      });
    } else if (targetStatus === 'Completed') {
      setConfirmModal({
        isOpen: true,
        requestId,
        targetStatus: 'Completed',
        title: 'Mark Item Received & Completed?',
        message: `Confirm that you have received "${itemName}" from the donor. This completes the circular exchange!`,
        isDanger: false
      });
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.requestId || !confirmModal.targetStatus) return;

    try {
      setActionLoading(true);
      await requestService.updateRequestStatus(confirmModal.requestId, {
        status: confirmModal.targetStatus
      });
      setConfirmModal({
        isOpen: false,
        requestId: null,
        targetStatus: null,
        title: '',
        message: '',
        isDanger: false
      });
      fetchMyRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="badge-eco">Student Requests</span>
        <h1 className="text-3xl font-extrabold text-campus-text tracking-tight">
          My Requested Items
        </h1>
        <p className="text-sm text-campus-textMuted">
          Track the status of campus items you have requested from fellow classmates.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="campus-card h-40 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No requested items yet"
          description="You haven't requested any campus items yet. Browse available textbooks, kits, and supplies to submit requests."
          actionText="Browse Campus Marketplace"
          actionLink="/browse"
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="campus-card p-5 sm:p-6 bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              {/* Item Thumbnail & Information */}
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

                  <div className="flex flex-wrap items-center gap-4 text-xs text-campus-textMuted">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-campus-primary" />
                      <span>
                        Donor: <span className="font-bold text-campus-text">{req.donor?.name}</span> (
                        {req.donor?.department})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-campus-primary" />
                      <span>{req.item?.pickupLocation}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Requested {new Date(req.requestedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Donor response message */}
                  {req.donorNote && (
                    <div className="p-2.5 bg-campus-secondary/40 rounded-xl text-xs text-campus-primaryDark font-medium flex items-start gap-2 max-w-xl">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Donor note: "{req.donorNote}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-end lg:self-center shrink-0">
                {req.status === 'Accepted' && (
                  <button
                    onClick={() =>
                      handleOpenConfirm(req._id, 'Completed', req.item?.itemName || 'Item')
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Received</span>
                  </button>
                )}

                {(req.status === 'Pending' || req.status === 'Accepted') && (
                  <button
                    onClick={() =>
                      handleOpenConfirm(req._id, 'Cancelled', req.item?.itemName || 'Item')
                    }
                    className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 hover:text-rose-600 hover:border-rose-200 text-xs font-bold rounded-xl transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Request</span>
                  </button>
                )}

                {req.status === 'Completed' && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">
                    Received & Completed ♻️
                  </span>
                )}

                {req.status === 'Rejected' && (
                  <span className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
                    Declined by Donor
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            requestId: null,
            targetStatus: null,
            title: '',
            message: '',
            isDanger: false
          })
        }
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.targetStatus === 'Cancelled' ? 'Cancel Request' : 'Confirm'}
        isDanger={confirmModal.isDanger}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default MyRequestsPage;
