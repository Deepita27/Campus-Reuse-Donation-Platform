import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PackagePlus,
  Edit3,
  Trash2,
  Eye,
  Inbox,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { itemService } from '../services/api';
import { ApprovalBadge, AvailabilityBadge, ConditionBadge } from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

const MyDonationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editItem, setEditItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    itemName: '',
    category: '',
    condition: '',
    description: '',
    pickupLocation: ''
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal State
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMyDonations = async () => {
    try {
      setLoading(true);
      const data = await itemService.getMyDonations();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const openEditModal = (item) => {
    setEditItem(item);
    setEditFormData({
      itemName: item.itemName,
      category: item.category,
      condition: item.condition,
      description: item.description,
      pickupLocation: item.pickupLocation
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editItem) return;

    try {
      setEditLoading(true);
      await itemService.updateItem(editItem._id, editFormData);
      setEditItem(null);
      fetchMyDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update item.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;
    try {
      setDeleteLoading(true);
      await itemService.deleteItem(deleteItemId);
      setDeleteItemId(null);
      fetchMyDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge-eco">My Contributions</span>
          <h1 className="text-3xl font-extrabold text-campus-text tracking-tight">
            My Donated Items
          </h1>
          <p className="text-sm text-campus-textMuted">
            Manage your item listings, track administrative approval, and monitor peer requests.
          </p>
        </div>

        <Link
          to="/donate"
          className="inline-flex items-center gap-2 px-5 py-3 bg-campus-primary hover:bg-campus-primaryDark text-white font-bold rounded-2xl shadow-sm text-sm transition self-start"
        >
          <PackagePlus className="w-4 h-4" />
          <span>+ Donate New Item</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="campus-card h-40 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={PackagePlus}
          title="No donations yet"
          description="Give what you don't need! Put your unused textbooks, components, or sports equipment to good use across campus."
          actionText="Donate An Item Now"
          actionLink="/donate"
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="campus-card p-5 sm:p-6 bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              {/* Item Thumbnail & Information */}
              <div className="flex items-start gap-4">
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-gray-100"
                />
                <div className="space-y-1.5 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-campus-primary">
                      {item.category}
                    </span>
                    <ConditionBadge condition={item.condition} />
                    <ApprovalBadge status={item.status} />
                    <AvailabilityBadge availability={item.availability} />
                  </div>

                  <Link to={`/items/${item._id}`}>
                    <h3 className="font-extrabold text-base sm:text-lg text-campus-text hover:text-campus-primary transition">
                      {item.itemName}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-campus-textMuted">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Posted {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-campus-primary" />
                      <span>{item.pickupLocation}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{item.viewCount || 0} views</span>
                    </div>
                  </div>

                  {item.status === 'Rejected' && item.rejectionReason && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Admin note: {item.rejectionReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Requests Counter & Actions */}
              <div className="flex flex-wrap items-center gap-2 self-end lg:self-center shrink-0">
                <Link
                  to="/requests/received"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-campus-secondary text-campus-primaryDark text-xs font-bold rounded-xl hover:bg-campus-secondaryDark transition"
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>
                    {item.pendingRequestsCount || 0} Request
                    {item.pendingRequestsCount === 1 ? '' : 's'}
                  </span>
                </Link>

                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 text-gray-500 hover:text-campus-primary hover:bg-gray-100 rounded-xl transition"
                  title="Edit listing"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeleteItemId(item._id)}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Listing Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-campus-text">Edit Listing</h3>
              <button
                onClick={() => setEditItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.itemName}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, itemName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.pickupLocation}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, pickupLocation: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 text-xs font-bold bg-campus-primary text-white rounded-xl hover:bg-campus-primaryDark transition disabled:opacity-60"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Item Listing?"
        message="Are you sure you want to remove this item listing? Any pending requests for this item will be cancelled."
        confirmText="Delete Listing"
        isDanger={true}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default MyDonationsPage;
