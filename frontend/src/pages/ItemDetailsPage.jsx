import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  User,
  Calendar,
  Share2,
  ArrowLeft,
  AlertCircle,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ConditionBadge, AvailabilityBadge, RequestStatusBadge } from '../components/StatusBadge';
import RequestModal from '../components/RequestModal';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [hasRequested, setHasRequested] = useState(false);
  const [userRequest, setUserRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItemById(id);
      if (data.success) {
        setItem(data.item);
        setHasRequested(data.hasRequested);
        setUserRequest(data.userRequest);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load item details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-campus-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-campus-textMuted">Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-campus-text">Item Not Found</h2>
        <p className="text-sm text-campus-textMuted">{error || 'This item may have been removed.'}</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-campus-primary text-white rounded-xl text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const isOwner = user && (item.donor?._id === user._id || item.donor === user._id);
  const isAvailable = item.availability === 'Available';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-campus-textMuted hover:text-campus-primary transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Large Image */}
        <div className="lg:col-span-7 space-y-4">
          <div className="campus-card overflow-hidden bg-gray-100 rounded-3xl aspect-[4/3] relative shadow-lg">
            <img
              src={item.image}
              alt={item.itemName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
              }}
            />

            <div className="absolute top-4 left-4">
              <ConditionBadge condition={item.condition} />
            </div>

            <div className="absolute top-4 right-4">
              <AvailabilityBadge availability={item.availability} />
            </div>
          </div>

          {/* Quick campus safety reminder */}
          <div className="p-4 bg-campus-secondary/40 rounded-2xl border border-campus-border flex items-center gap-3 text-xs text-campus-primaryDark font-medium">
            <ShieldCheck className="w-5 h-5 text-campus-primary shrink-0" />
            <span>
              Always meet for exchanges during daytime at visible campus locations like the Library,
              Department Lounge, or Cafeteria.
            </span>
          </div>
        </div>

        {/* Right Column: Information, Donor, Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-primary">
              {item.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-text tracking-tight leading-tight">
              {item.itemName}
            </h1>
            <div className="flex items-center gap-4 text-xs text-campus-textMuted pt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Posted{' '}
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{item.viewCount || 1} views</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-campus-textMuted">
              Description
            </h3>
            <p className="text-sm text-campus-text leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-campus-border">
              {item.description}
            </p>
          </div>

          {/* Campus Pickup Location */}
          <div className="p-4 bg-white rounded-2xl border border-campus-border space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-textMuted">
              Campus Pickup Location
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-campus-text">
              <MapPin className="w-4 h-4 text-campus-primary shrink-0" />
              <span>{item.pickupLocation}</span>
            </div>
          </div>

          {/* Donor Information Card */}
          <div className="p-4 bg-white rounded-2xl border border-campus-border space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-textMuted">
              Donated By
            </span>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-campus-secondary text-campus-primaryDark font-extrabold flex items-center justify-center text-base">
                {item.donor?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-campus-text">
                  {item.donor?.name || item.donorName || 'Campus Student'}
                </h4>
                <p className="text-xs text-campus-textMuted">
                  {item.donor?.department || item.donorDepartment} • {item.donor?.year || 'Student'}
                </p>
              </div>
            </div>
          </div>

          {/* Request Action Button / Status Notice */}
          <div className="pt-2">
            {isOwner ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-2">
                <span className="text-xs font-bold text-amber-800 block">
                  You are the donor of this item listing.
                </span>
                <Link
                  to="/my-donations"
                  className="inline-block text-xs font-bold text-campus-primary underline"
                >
                  Manage this listing in My Donations
                </Link>
              </div>
            ) : hasRequested ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You have an active request for this item!</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="text-campus-textMuted">Status:</span>
                  <RequestStatusBadge status={userRequest?.status || 'Pending'} />
                </div>
                <Link
                  to="/my-requests"
                  className="block text-xs font-bold text-campus-primary hover:underline pt-1"
                >
                  View and manage in My Requests →
                </Link>
              </div>
            ) : !isAvailable ? (
              <div className="p-4 bg-gray-100 rounded-2xl text-center text-xs text-gray-500 font-bold">
                This item is currently {item.availability.toLowerCase()} and cannot be requested.
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(`/login?redirect=/items/${item._id}`);
                    return;
                  }
                  setIsRequestModalOpen(true);
                }}
                className="w-full py-4 px-6 bg-campus-primary hover:bg-campus-primaryDark text-white font-extrabold rounded-2xl shadow-lg shadow-campus-primary/20 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base"
              >
                <Sparkles className="w-5 h-5 text-campus-accent" />
                <span>Request This Item</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        item={item}
        onSuccess={fetchItemDetails}
      />
    </div>
  );
};

export default ItemDetailsPage;
