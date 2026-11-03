import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Recycle,
  PlusCircle,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Package,
  Layers,
  Inbox,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-campus-border/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Platform Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-campus-primary flex items-center justify-center text-white shadow-md shadow-campus-primary/20 group-hover:bg-campus-primaryDark transition">
              <Recycle className="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-campus-primary tracking-tight block">
                CAMPUS<span className="text-campus-text">REUSE</span>
              </span>
              <span className="text-[10px] text-campus-textMuted tracking-wider uppercase font-semibold hidden sm:block">
                Give & Get Circular Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'text-campus-primary bg-campus-secondary/60'
                    : 'text-campus-textMuted hover:text-campus-primary hover:bg-gray-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/browse"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'text-campus-primary bg-campus-secondary/60'
                    : 'text-campus-textMuted hover:text-campus-primary hover:bg-gray-50'
                }`
              }
            >
              Browse Items
            </NavLink>

            {isAuthenticated && !isAdmin && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'text-campus-primary bg-campus-secondary/60'
                        : 'text-campus-textMuted hover:text-campus-primary hover:bg-gray-50'
                    }`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/my-donations"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'text-campus-primary bg-campus-secondary/60'
                        : 'text-campus-textMuted hover:text-campus-primary hover:bg-gray-50'
                    }`
                  }
                >
                  My Donations
                </NavLink>

                <NavLink
                  to="/my-requests"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'text-campus-primary bg-campus-secondary/60'
                        : 'text-campus-textMuted hover:text-campus-primary hover:bg-gray-50'
                    }`
                  }
                >
                  My Requests
                </NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'text-campus-primary bg-campus-secondary/60'
                      : 'text-campus-textMuted hover:text-campus-primary hover:bg-gray-50'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Admin Dashboard
              </NavLink>
            )}

            {!isAuthenticated && (
              <>
                <a
                  href="/#how-it-works"
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-campus-textMuted hover:text-campus-primary hover:bg-gray-50 transition"
                >
                  How It Works
                </a>
                <a
                  href="/#impact"
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-campus-textMuted hover:text-campus-primary hover:bg-gray-50 transition"
                >
                  Impact
                </a>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Donate Item CTA for students */}
                {!isAdmin && (
                  <Link
                    to="/donate"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-campus-primary hover:bg-campus-primaryDark text-white text-sm font-bold rounded-xl shadow-sm transition hover:shadow"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Donate Item</span>
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="relative" ref={notifMenuRef}>
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="relative p-2.5 rounded-xl text-campus-textMuted hover:text-campus-primary hover:bg-campus-secondary/40 transition"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-campus-text">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="bg-campus-secondary text-campus-primaryDark text-xs font-semibold px-2 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-campus-primary hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-campus-textMuted text-xs">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.slice(0, 10).map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                if (n.link) navigate(n.link);
                                setNotificationsOpen(false);
                              }}
                              className={`p-3 sm:p-4 text-xs cursor-pointer transition hover:bg-gray-50 ${
                                !n.isRead ? 'bg-campus-secondary/20' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full mt-1 shrink-0 bg-campus-primary" />
                                <div className="flex-1">
                                  <p className="text-campus-text leading-snug">{n.message}</p>
                                  <span className="text-[10px] text-campus-textMuted mt-1 block">
                                    {new Date(n.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-gray-200 hover:border-campus-primary/40 hover:bg-gray-50 transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-campus-secondary text-campus-primaryDark font-bold text-xs flex items-center justify-center">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-campus-text max-w-[120px] truncate">
                      {user?.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-campus-textMuted">Signed in as</p>
                        <p className="text-sm font-bold text-campus-text truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-campus-secondary text-campus-primaryDark">
                          {user?.role === 'admin' ? 'Administrator' : `${user?.department} • ${user?.year}`}
                        </span>
                      </div>

                      <div className="py-1">
                        {!isAdmin && (
                          <>
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <Layers className="w-4 h-4 text-campus-primary" />
                              <span>Student Dashboard</span>
                            </Link>

                            <Link
                              to="/requests/received"
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <Inbox className="w-4 h-4 text-campus-primary" />
                              <span>Incoming Requests</span>
                            </Link>
                          </>
                        )}

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <ShieldCheck className="w-4 h-4 text-campus-primary" />
                            <span>Admin Center</span>
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <User className="w-4 h-4 text-campus-primary" />
                          <span>My Profile</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-campus-primary hover:bg-campus-secondary/50 rounded-xl transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-campus-primary hover:bg-campus-primaryDark text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition"
                >
                  Join Campus
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-campus-textMuted"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-campus-text hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/"
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-campus-text hover:bg-gray-50"
          >
            Home
          </NavLink>
          <NavLink
            to="/browse"
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-campus-text hover:bg-gray-50"
          >
            Browse Marketplace
          </NavLink>

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <NavLink
                    to="/dashboard"
                    className="block px-3 py-2.5 rounded-xl text-base font-semibold text-campus-text hover:bg-gray-50"
                  >
                    Student Dashboard
                  </NavLink>
                  <NavLink
                    to="/donate"
                    className="block px-3 py-2.5 rounded-xl text-base font-semibold text-campus-primary bg-campus-secondary/50"
                  >
                    + Donate an Item
                  </NavLink>
                  <NavLink
                    to="/my-donations"
                    className="block px-3 py-2.5 rounded-xl text-base font-semibold text-campus-text hover:bg-gray-50"
                  >
                    My Donations
                  </NavLink>
                  <NavLink
                    to="/my-requests"
                    className="block px-3 py-2.5 rounded-xl text-base font-semibold text-campus-text hover:bg-gray-50"
                  >
                    My Requests
                  </NavLink>
                </>
              )}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-campus-primary bg-campus-secondary/50"
                >
                  Admin Center
                </NavLink>
              )}

              <NavLink
                to="/profile"
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-campus-text hover:bg-gray-50"
              >
                Profile & Settings
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50"
              >
                Log Out ({user?.name})
              </button>
            </>
          ) : (
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block text-center py-2.5 border border-campus-primary text-campus-primary rounded-xl font-bold text-sm"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="block text-center py-2.5 bg-campus-primary text-white rounded-xl font-bold text-sm"
              >
                Register as Student
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
