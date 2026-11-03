import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Sparkles } from 'lucide-react';

export const ConditionBadge = ({ condition }) => {
  const styles = {
    New: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Like New': 'bg-teal-50 text-teal-800 border-teal-200',
    Good: 'bg-blue-50 text-blue-800 border-blue-200',
    Fair: 'bg-amber-50 text-amber-800 border-amber-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[condition] || 'bg-gray-100 text-gray-700 border-gray-200'
      }`}
    >
      <Sparkles className="w-3 h-3" />
      {condition}
    </span>
  );
};

export const AvailabilityBadge = ({ availability }) => {
  const styles = {
    Available: 'bg-emerald-100 text-campus-primaryDark font-medium',
    Reserved: 'bg-purple-100 text-purple-800 font-medium',
    Completed: 'bg-gray-100 text-gray-700 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
        styles[availability] || 'bg-gray-100 text-gray-700'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          availability === 'Available'
            ? 'bg-emerald-500 animate-pulse'
            : availability === 'Reserved'
            ? 'bg-purple-500'
            : 'bg-gray-400'
        }`}
      />
      {availability}
    </span>
  );
};

export const ApprovalBadge = ({ status }) => {
  const styles = {
    Approved: {
      className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      label: 'Approved & Live'
    },
    Pending: {
      className: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
      label: 'Pending Review'
    },
    Rejected: {
      className: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: XCircle,
      label: 'Rejected'
    }
  };

  const current = styles[status] || styles.Pending;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {current.label}
    </span>
  );
};

export const RequestStatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-100 text-amber-900 border-amber-200',
    Accepted: 'bg-emerald-100 text-campus-primaryDark border-emerald-200',
    Rejected: 'bg-rose-100 text-rose-900 border-rose-200',
    Completed: 'bg-blue-100 text-blue-900 border-blue-200',
    Cancelled: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
      {status === 'Accepted' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
      {status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
      {status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
      {status === 'Cancelled' && <AlertCircle className="w-3 h-3 text-gray-500" />}
      {status}
    </span>
  );
};
