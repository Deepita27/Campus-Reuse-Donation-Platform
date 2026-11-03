import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helper for evaluators
  const fillDemoStudent = () => {
    setEmail('alex@campus.edu');
    setPassword('StudentPass123!');
    setError('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@campus.edu');
    setPassword('AdminPassword123!');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-campus-border shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-campus-secondary text-campus-primary rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold text-xl">
            ♻️
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-campus-text tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-campus-textMuted">
            Log in to your campus account to manage donations and requests.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-campus-textMuted mb-1.5">
              College Email ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-campus-textMuted mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-campus-primary hover:bg-campus-primaryDark text-white font-bold rounded-xl text-sm transition shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Campus'}</span>
          </button>
        </form>

        {/* Demo Fast-Login Helpers */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-campus-textMuted text-center">
            Demo Evaluation Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="py-2 px-2.5 bg-campus-secondary/60 hover:bg-campus-secondary text-campus-primaryDark text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Demo</span>
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-2 px-2.5 bg-campus-accent/20 hover:bg-campus-accent/30 text-campus-text text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-campus-primary" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-campus-textMuted">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-campus-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
