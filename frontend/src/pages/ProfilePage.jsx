import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    department: user?.department || 'Computer Science',
    year: user?.year || '1st Year',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const departments = [
    'Computer Science',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Biotechnology',
    'Business Administration',
    'Physics & Chemistry',
    'Architecture & Design',
    'Humanities & Social Sciences'
  ];

  const years = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'Postgraduate',
    'Faculty/Staff'
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      const data = await authService.updateProfile(profileData);
      if (data.success && data.user) {
        updateUser(data.user);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordLoading(true);

    try {
      const data = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (data.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setTimeout(() => setPasswordSuccess(''), 3000);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="badge-eco">Student Profile</span>
        <h1 className="text-3xl font-extrabold text-campus-text tracking-tight">
          Account & Campus Profile
        </h1>
        <p className="text-sm text-campus-textMuted">
          Manage your personal details, campus contacts, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card Summary */}
        <div className="md:col-span-4 space-y-4">
          <div className="campus-card p-6 bg-white text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-campus-secondary text-campus-primaryDark font-extrabold text-2xl flex items-center justify-center mx-auto ring-8 ring-campus-secondary/30">
              {user?.name?.charAt(0) || 'U'}
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-campus-text">{user?.name}</h3>
              <p className="text-xs text-campus-textMuted">{user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-campus-secondary/70 text-campus-primaryDark text-xs font-bold rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{user?.role === 'admin' ? 'Administrator' : 'Verified Student'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-campus-border text-left space-y-2 text-xs">
              <div>
                <span className="text-campus-textMuted block">Student ID / Roll No</span>
                <span className="font-mono font-bold text-campus-text">{user?.studentId}</span>
              </div>
              <div>
                <span className="text-campus-textMuted block">Department</span>
                <span className="font-semibold text-campus-text">{user?.department}</span>
              </div>
              <div>
                <span className="text-campus-textMuted block">Year of Study</span>
                <span className="font-semibold text-campus-text">{user?.year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Forms */}
        <div className="md:col-span-8 space-y-8">
          {/* Profile Details Form */}
          <div className="campus-card p-6 sm:p-7 bg-white space-y-5">
            <h3 className="font-extrabold text-lg text-campus-text flex items-center gap-2">
              <User className="w-5 h-5 text-campus-primary" />
              <span>Personal Details</span>
            </h3>

            {profileSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                    Department
                  </label>
                  <select
                    value={profileData.department}
                    onChange={(e) =>
                      setProfileData({ ...profileData, department: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary bg-white"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                    Year of Study
                  </label>
                  <select
                    value={profileData.year}
                    onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary bg-white"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                  Contact Phone (for pickup coordination)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                  Campus Bio / Note
                </label>
                <textarea
                  rows={2}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Share a short note with fellow students..."
                  className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-campus-primary hover:bg-campus-primaryDark text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="campus-card p-6 sm:p-7 bg-white space-y-5">
            <h3 className="font-extrabold text-lg text-campus-text flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-campus-primary" />
              <span>Change Password</span>
            </h3>

            {passwordSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-campus-textMuted mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <Lock className="w-4 h-4" />
                <span>{passwordLoading ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
