import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PackagePlus,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Inbox,
  AlertCircle,
  ExternalLink,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { itemService, requestService } from '../services/api';
import ItemCard from '../components/ItemCard';
import { RequestStatusBadge, AvailabilityBadge } from '../components/StatusBadge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myDonations: 0,
    myRequests: 0,
    availableItems: 0,
    completedDonations: 0
  });
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [featuredCampusItems, setFeaturedCampusItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [donationsRes, myReqRes, recReqRes, campusItemsRes] = await Promise.all([
          itemService.getMyDonations(),
          requestService.getMyRequests(),
          requestService.getReceivedRequests(),
          itemService.getFeaturedItems()
        ]);

        const donations = donationsRes.items || [];
        const myRequests = myReqRes.requests || [];
        const incoming = recReqRes.requests || [];

        const completedCount = donations.filter((d) => d.availability === 'Completed').length;

        setMyDonations(donations);
        setReceivedRequests(incoming);
        setRecentRequests(myRequests);
        setFeaturedCampusItems(campusItemsRes.items || []);

        setStats({
          myDonations: donations.length,
          myRequests: myRequests.length,
          availableItems: donations.filter((d) => d.availability === 'Available').length,
          completedDonations: completedCount
        });
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pendingIncoming = receivedRequests.filter((r) => r.status === 'Pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. PERSONALIZED WELCOME BANNER */}
      <div className="campus-card bg-gradient-to-r from-campus-primaryDark via-campus-primary to-emerald-800 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-campus-secondary text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-campus-accent" />
              <span>Campus Circular Economy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-200">
              {user?.department} • {user?.year} (ID: {user?.studentId})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 px-5 py-3 bg-campus-accent hover:bg-campus-accentHover text-campus-text text-sm font-bold rounded-2xl shadow-md transition"
            >
              <PackagePlus className="w-4 h-4 text-campus-text" />
              <span>+ Donate an Item</span>
            </Link>

            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-2xl backdrop-blur-sm transition border border-white/20"
            >
              <span>Browse Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. FOUR STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: My Donations */}
        <div className="campus-card p-5 sm:p-6 bg-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-textMuted">
              My Donations
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-campus-text">
              {stats.myDonations}
            </div>
            <Link
              to="/my-donations"
              className="text-xs text-campus-primary font-bold hover:underline inline-flex items-center gap-1 pt-1"
            >
              View listings <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PackagePlus className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: My Requests */}
        <div className="campus-card p-5 sm:p-6 bg-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-textMuted">
              My Requests
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-campus-text">
              {stats.myRequests}
            </div>
            <Link
              to="/my-requests"
              className="text-xs text-campus-primary font-bold hover:underline inline-flex items-center gap-1 pt-1"
            >
              Track requests <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Available Items */}
        <div className="campus-card p-5 sm:p-6 bg-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-textMuted">
              Live & Available
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-campus-text">
              {stats.availableItems}
            </div>
            <span className="text-xs text-campus-textMuted pt-1 block">Awaiting requests</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Completed Donations */}
        <div className="campus-card p-5 sm:p-6 bg-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-textMuted">
              Completed Reuse
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-campus-text">
              {stats.completedDonations}
            </div>
            <span className="text-xs text-emerald-600 font-bold pt-1 block">Exchanges done</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-campus-secondary text-campus-primaryDark flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. PENDING INCOMING REQUESTS NOTIFICATION BANNER (if any) */}
      {pendingIncoming.length > 0 && (
        <div className="campus-card bg-amber-50/80 border border-amber-200 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-950">
                  You Have {pendingIncoming.length} Incoming Request
                  {pendingIncoming.length > 1 ? 's' : ''} Awaiting Response!
                </h3>
                <p className="text-xs text-amber-800">
                  Students have requested items you posted. Review and accept requests to reserve the
                  item.
                </p>
              </div>
            </div>
            <Link
              to="/requests/received"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
            >
              Respond to Requests
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {pendingIncoming.slice(0, 2).map((req) => (
              <div
                key={req._id}
                className="bg-white p-3.5 rounded-xl border border-amber-200/60 flex items-center gap-3 text-xs"
              >
                <img
                  src={req.item?.image}
                  alt={req.item?.itemName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-campus-text truncate">{req.item?.itemName}</p>
                  <p className="text-campus-textMuted truncate">
                    Requested by <span className="font-semibold">{req.requester?.name}</span> (
                    {req.requester?.department})
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date(req.requestedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MAIN DASHBOARD SPLIT: RECENT DONATIONS & RECENT REQUESTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: My Recent Donations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-text">My Recent Item Listings</h2>
            <Link
              to="/my-donations"
              className="text-xs font-bold text-campus-primary hover:underline flex items-center gap-1"
            >
              Manage all ({myDonations.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {myDonations.length === 0 ? (
            <div className="campus-card p-8 text-center space-y-3 bg-white">
              <p className="text-sm text-campus-textMuted">You haven't posted any items yet.</p>
              <Link
                to="/donate"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-campus-primary text-white text-xs font-bold rounded-xl"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>Donate Your First Item</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myDonations.slice(0, 4).map((item) => (
                <div
                  key={item._id}
                  className="campus-card p-4 bg-white flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-campus-primary">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-sm text-campus-text truncate">
                        {item.itemName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-campus-textMuted mt-1">
                        <MapPin className="w-3 h-3 text-campus-primary" />
                        <span className="truncate">{item.pickupLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <AvailabilityBadge availability={item.availability} />
                    <span className="text-[11px] text-campus-textMuted block">
                      {item.pendingRequestsCount || 0} request
                      {item.pendingRequestsCount === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: My Outgoing Requests */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-campus-text">My Requested Items</h2>
            <Link
              to="/my-requests"
              className="text-xs font-bold text-campus-primary hover:underline flex items-center gap-1"
            >
              All requests ({recentRequests.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="campus-card p-8 text-center space-y-3 bg-white">
              <p className="text-sm text-campus-textMuted">You haven't requested any items yet.</p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-campus-primary text-white text-xs font-bold rounded-xl"
              >
                <span>Browse Available Items</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.slice(0, 4).map((req) => (
                <div key={req._id} className="campus-card p-3.5 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-campus-text truncate max-w-[180px]">
                      {req.item?.itemName}
                    </span>
                    <RequestStatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-campus-textMuted">
                    Donor: <span className="font-semibold">{req.donor?.name}</span> (
                    {req.donor?.department})
                  </p>
                  {req.donorNote && (
                    <div className="p-2 bg-campus-secondary/40 rounded-lg text-xs text-campus-primaryDark font-medium">
                      "{req.donorNote}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. CAMPUS ITEMS YOU MIGHT NEED */}
      <div className="space-y-4 pt-4 border-t border-campus-border/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-campus-text">
              Available on Campus Right Now
            </h2>
            <p className="text-xs sm:text-sm text-campus-textMuted">
              Recently approved donations ready for student request.
            </p>
          </div>
          <Link
            to="/browse"
            className="text-xs sm:text-sm font-bold text-campus-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Explore all</span> <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCampusItems.slice(0, 3).map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
