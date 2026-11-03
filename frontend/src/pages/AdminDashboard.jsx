import React, { useEffect, useState } from 'react';
import {
  Users,
  Package,
  Clock,
  CheckCircle2,
  Send,
  ShieldAlert,
  Search,
  Check,
  X,
  Trash2,
  Lock,
  Unlock,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  Eye,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { adminService } from '../services/api';
import { ApprovalBadge, AvailabilityBadge, RequestStatusBadge } from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'users' | 'requests' | 'analytics'

  // Overview stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDonations: 0,
    availableItems: 0,
    pendingApprovals: 0,
    completedDonations: 0,
    totalRequests: 0
  });

  // Items Moderation Tab
  const [items, setItems] = useState([]);
  const [itemStatusFilter, setItemStatusFilter] = useState('Pending'); // default to Pending for fast review!
  const [itemSearch, setItemSearch] = useState('');
  const [itemsLoading, setItemsLoading] = useState(false);

  // Users Tab
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  // Requests Tab
  const [requests, setRequests] = useState([]);
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');
  const [requestsLoading, setRequestsLoading] = useState(false);

  // Analytics Tab
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Modals
  const [rejectModal, setRejectModal] = useState({ isOpen: false, itemId: null, itemTitle: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null, itemTitle: '' });
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch Overview Stats
  const fetchDashboardStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  // Fetch Items
  const fetchItems = async () => {
    try {
      setItemsLoading(true);
      const data = await adminService.getAdminItems({
        status: itemStatusFilter,
        search: itemSearch
      });
      if (data.success) setItems(data.items || []);
    } catch (err) {
      console.error('Failed to load admin items:', err);
    } finally {
      setItemsLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await adminService.getUsers({ search: userSearch });
      if (data.success) setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch Requests
  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const data = await adminService.getAdminRequests({ status: requestStatusFilter });
      if (data.success) setRequests(data.requests || []);
    } catch (err) {
      console.error('Failed to load admin requests:', err);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch Analytics
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const data = await adminService.getAnalytics();
      if (data.success) setAnalytics(data.analytics);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'items') fetchItems();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'analytics') fetchAnalytics();
  }, [activeTab, itemStatusFilter, requestStatusFilter]);

  // Approve Item
  const handleApprove = async (id) => {
    try {
      await adminService.approveItem(id);
      fetchItems();
      fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve item.');
    }
  };

  // Reject Item
  const handleRejectConfirm = async () => {
    if (!rejectModal.itemId) return;
    try {
      setModalLoading(true);
      await adminService.rejectItem(rejectModal.itemId, rejectReason);
      setRejectModal({ isOpen: false, itemId: null, itemTitle: '' });
      setRejectReason('');
      fetchItems();
      fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject item.');
    } finally {
      setModalLoading(false);
    }
  };

  // Delete Item
  const handleDeleteConfirm = async () => {
    if (!deleteModal.itemId) return;
    try {
      setModalLoading(true);
      await adminService.deleteItem(deleteModal.itemId);
      setDeleteModal({ isOpen: false, itemId: null, itemTitle: '' });
      fetchItems();
      fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item.');
    } finally {
      setModalLoading(false);
    }
  };

  // Block / Unblock User
  const handleToggleBlock = async (userId) => {
    try {
      await adminService.toggleBlockUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user block status.');
    }
  };

  const PIE_COLORS = ['#176B4D', '#238965', '#F4C95D', '#E2847A', '#6366F1'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge-eco">Admin Center</span>
          <h1 className="text-3xl font-extrabold text-campus-text tracking-tight">
            Campus Platform Administration
          </h1>
          <p className="text-sm text-campus-textMuted">
            Review submitted items, moderate students, supervise exchanges, and analyze impact.
          </p>
        </div>
      </div>

      {/* Top Overview 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="campus-card p-4 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase text-campus-textMuted block">Students</span>
          <div className="text-2xl font-extrabold text-campus-text">{stats.totalStudents}</div>
          <span className="text-[10px] text-campus-primary font-semibold">Registered</span>
        </div>

        <div className="campus-card p-4 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase text-campus-textMuted block">Donations</span>
          <div className="text-2xl font-extrabold text-campus-text">{stats.totalDonations}</div>
          <span className="text-[10px] text-campus-primary font-semibold">Total posted</span>
        </div>

        <div className="campus-card p-4 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase text-campus-textMuted block">Available</span>
          <div className="text-2xl font-extrabold text-emerald-600">{stats.availableItems}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready to request</span>
        </div>

        <div className="campus-card p-4 bg-white space-y-1 border-amber-200 bg-amber-50/40">
          <span className="text-[11px] font-bold uppercase text-amber-800 block">Pending</span>
          <div className="text-2xl font-extrabold text-amber-600">{stats.pendingApprovals}</div>
          <span className="text-[10px] text-amber-800 font-semibold">Needs review</span>
        </div>

        <div className="campus-card p-4 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase text-campus-textMuted block">Completed</span>
          <div className="text-2xl font-extrabold text-blue-600">{stats.completedDonations}</div>
          <span className="text-[10px] text-blue-600 font-semibold">Reused on campus</span>
        </div>

        <div className="campus-card p-4 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase text-campus-textMuted block">Requests</span>
          <div className="text-2xl font-extrabold text-purple-600">{stats.totalRequests}</div>
          <span className="text-[10px] text-purple-600 font-semibold">Peer-to-peer</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-campus-border overflow-x-auto space-x-2">
        <button
          onClick={() => setActiveTab('items')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'items'
              ? 'border-campus-primary text-campus-primary'
              : 'border-transparent text-campus-textMuted hover:text-campus-text'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Item Moderation ({stats.pendingApprovals} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-campus-primary text-campus-primary'
              : 'border-transparent text-campus-textMuted hover:text-campus-text'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-campus-primary text-campus-primary'
              : 'border-transparent text-campus-textMuted hover:text-campus-text'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Request Monitoring</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-campus-primary text-campus-primary'
              : 'border-transparent text-campus-textMuted hover:text-campus-text'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Eco Impact</span>
        </button>
      </div>

      {/* TAB 1: ITEM MODERATION */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-campus-border">
              {['Pending', 'Approved', 'Rejected', 'all'].map((st) => (
                <button
                  key={st}
                  onClick={() => setItemStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition uppercase ${
                    itemStatusFilter === st
                      ? 'bg-campus-primary text-white shadow-sm'
                      : 'text-campus-textMuted hover:text-campus-text'
                  }`}
                >
                  {st === 'all' ? 'All Items' : st}
                </button>
              ))}
            </div>

            {/* Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchItems();
              }}
              className="relative w-full sm:w-72"
            >
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                placeholder="Search items or donors..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary bg-white"
              />
            </form>
          </div>

          {itemsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="campus-card h-28 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-campus-border">
              <p className="text-sm text-campus-textMuted">No items found matching filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="campus-card p-4 sm:p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                    />
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-campus-primary">
                          {item.category}
                        </span>
                        <ApprovalBadge status={item.status} />
                        <AvailabilityBadge availability={item.availability} />
                      </div>

                      <h3 className="font-bold text-base text-campus-text truncate">
                        {item.itemName}
                      </h3>

                      <p className="text-xs text-campus-textMuted line-clamp-1 max-w-xl">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-campus-textMuted pt-0.5">
                        <span>
                          Donor: <span className="font-semibold text-campus-text">{item.donor?.name || item.donorName}</span> ({item.donor?.department || item.donorDepartment})
                        </span>
                        <span>•</span>
                        <span>Pickup: {item.pickupLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Action Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {item.status !== 'Approved' && (
                      <button
                        onClick={() => handleApprove(item._id)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {item.status !== 'Rejected' && (
                      <button
                        onClick={() =>
                          setRejectModal({
                            isOpen: true,
                            itemId: item._id,
                            itemTitle: item.itemName
                          })
                        }
                        className="inline-flex items-center gap-1 px-3 py-2 border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold rounded-xl transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          itemId: item._id,
                          itemTitle: item.itemName
                        })
                      }
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete inappropriate listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchUsers();
              }}
              className="relative w-full sm:w-80"
            >
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by student name, roll no, or email..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary bg-white"
              />
            </form>
          </div>

          <div className="campus-card bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-campus-bg border-b border-campus-border text-campus-textMuted uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Student / User</th>
                    <th className="p-4">Student ID</th>
                    <th className="p-4">Department & Year</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Account Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/80 transition">
                      <td className="p-4">
                        <div className="font-bold text-campus-text">{u.name}</div>
                        <div className="text-campus-textMuted text-[11px]">{u.email}</div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-campus-primary">
                        {u.studentId}
                      </td>
                      <td className="p-4">
                        <div>{u.department}</div>
                        <div className="text-campus-textMuted text-[11px]">{u.year}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-campus-secondary text-campus-primaryDark'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Unlock className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleBlock(u._id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                              u.isBlocked
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                          >
                            {u.isBlocked ? 'Unblock Account' : 'Block Student'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REQUEST MONITORING */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-campus-border">
              {['all', 'Pending', 'Accepted', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setRequestStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition uppercase ${
                    requestStatusFilter === st
                      ? 'bg-campus-primary text-white shadow-sm'
                      : 'text-campus-textMuted hover:text-campus-text'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="campus-card bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-campus-bg border-b border-campus-border text-campus-textMuted uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Requester</th>
                    <th className="p-4">Donor</th>
                    <th className="p-4">Date Requested</th>
                    <th className="p-4">Request Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50/80 transition">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={r.item?.image}
                          alt={r.item?.itemName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-bold text-campus-text">{r.item?.itemName}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-campus-text">{r.requester?.name}</div>
                        <div className="text-campus-textMuted text-[11px]">
                          {r.requester?.department} ({r.requester?.studentId})
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-campus-text">{r.donor?.name}</div>
                        <div className="text-campus-textMuted text-[11px]">{r.donor?.department}</div>
                      </td>
                      <td className="p-4 text-campus-textMuted">
                        {new Date(r.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <RequestStatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS & ECO IMPACT (RECHARTS) */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          {/* Sustainability Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="campus-card p-6 bg-emerald-50/60 border-emerald-200">
              <span className="text-xs font-bold uppercase text-emerald-800">
                Landfill Waste Diverted
              </span>
              <div className="text-3xl font-extrabold text-campus-primary mt-1">
                {analytics.impact?.wasteDivertedKg} kg
              </div>
              <span className="text-xs text-campus-textMuted">Solid campus materials saved</span>
            </div>

            <div className="campus-card p-6 bg-teal-50/60 border-teal-200">
              <span className="text-xs font-bold uppercase text-teal-800">CO2 Emissions Avoided</span>
              <div className="text-3xl font-extrabold text-teal-700 mt-1">
                {analytics.impact?.co2SavedKg} kg CO2e
              </div>
              <span className="text-xs text-campus-textMuted">Equivalent to 45 trees planted</span>
            </div>

            <div className="campus-card p-6 bg-amber-50/60 border-amber-200">
              <span className="text-xs font-bold uppercase text-amber-800">Student Costs Saved</span>
              <div className="text-3xl font-extrabold text-amber-700 mt-1">
                ${analytics.impact?.estimatedSavingsUSD}
              </div>
              <span className="text-xs text-campus-textMuted">Zero-cost peer sharing</span>
            </div>

            <div className="campus-card p-6 bg-blue-50/60 border-blue-200">
              <span className="text-xs font-bold uppercase text-blue-800">Participating Students</span>
              <div className="text-3xl font-extrabold text-blue-700 mt-1">
                {analytics.impact?.activeParticipatingStudents}
              </div>
              <span className="text-xs text-campus-textMuted">Active circular community</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown Bar Chart */}
            <div className="campus-card p-6 bg-white space-y-4">
              <h3 className="font-extrabold text-base text-campus-text">
                Donation Items by Campus Category
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.categoriesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EBE5" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #E2EBE5'
                      }}
                    />
                    <Bar dataKey="count" fill="#176B4D" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend Line Chart */}
            <div className="campus-card p-6 bg-white space-y-4">
              <h3 className="font-extrabold text-base text-campus-text">
                Monthly Activity & Exchanges Trend
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EBE5" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #E2EBE5'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line
                      type="monotone"
                      dataKey="donations"
                      name="Donated Items"
                      stroke="#176B4D"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      name="Student Requests"
                      stroke="#F4C95D"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Completed Handover"
                      stroke="#2563EB"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with reason input */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-campus-text">
              Reject Listing: {rejectModal.itemTitle}
            </h3>
            <p className="text-xs text-campus-textMuted">
              Provide a constructive reason explaining why this item does not meet campus reuse
              standards so the student can update it.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Photo is blurry, item condition seems damaged beyond safe use..."
              className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModal({ isOpen: false, itemId: null, itemTitle: '' })}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={modalLoading}
                onClick={handleRejectConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition"
              >
                {modalLoading ? 'Submitting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Permanently Remove Listing?"
        message={`Are you sure you want to remove "${deleteModal.itemTitle}"? This will cancel any pending requests for this item.`}
        confirmText="Remove Listing"
        isDanger={true}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default AdminDashboard;
