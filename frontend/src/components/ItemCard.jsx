import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, ArrowRight, Heart } from 'lucide-react';
import { ConditionBadge, AvailabilityBadge } from './StatusBadge';
import RequestModal from './RequestModal';
import { useAuth } from '../context/AuthContext';

const ItemCard = ({ item, onUpdate }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const isOwner = user && item.donor && (item.donor._id === user._id || item.donor === user._id);
  const isAvailable = item.availability === 'Available';

  const handleRequestClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login?redirect=/browse');
      return;
    }
    setIsRequestModalOpen(true);
  };

  return (
    <>
      <div className="campus-card campus-card-hover flex flex-col h-full overflow-hidden group">
        {/* Card Header & Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img
            src={item.image}
            alt={item.itemName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Condition tag over image */}
          <div className="absolute top-3 left-3">
            <ConditionBadge condition={item.condition} />
          </div>

          {/* Availability badge over image */}
          <div className="absolute top-3 right-3">
            <AvailabilityBadge availability={item.availability} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Category */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-campus-primary">
              {item.category}
            </span>
            <span className="text-[11px] text-campus-textMuted">
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Item Name */}
          <Link to={`/items/${item._id}`}>
            <h3 className="font-bold text-campus-text text-base sm:text-lg line-clamp-1 hover:text-campus-primary transition mb-2">
              {item.itemName}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-campus-textMuted text-xs sm:text-sm line-clamp-2 mb-4 flex-1">
            {item.description}
          </p>

          {/* Donor info & Location */}
          <div className="pt-3 border-t border-campus-border/60 space-y-1.5 text-xs text-campus-textMuted mb-4">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-campus-primary shrink-0" />
              <span className="font-medium text-campus-text truncate">
                {item.donor?.name || item.donorName || 'Campus Student'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="truncate">
                {item.donor?.department || item.donorDepartment || 'Student'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-campus-primary shrink-0" />
              <span className="truncate">{item.pickupLocation}</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Link
              to={`/items/${item._id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 hover:border-campus-primary hover:text-campus-primary text-xs font-semibold rounded-xl transition text-campus-text"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {isOwner ? (
              <span className="px-3 py-2 bg-gray-100 text-gray-500 text-xs font-medium rounded-xl">
                Your Listing
              </span>
            ) : isAvailable ? (
              <button
                onClick={handleRequestClick}
                className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 bg-campus-primary hover:bg-campus-primaryDark text-white text-xs font-semibold rounded-xl transition shadow-sm"
              >
                Request Item
              </button>
            ) : (
              <span className="flex-1 text-center py-2 px-3 bg-gray-100 text-gray-500 text-xs font-medium rounded-xl">
                {item.availability}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        item={item}
        onSuccess={() => {
          if (onUpdate) onUpdate();
        }}
      />
    </>
  );
};

export default ItemCard;
