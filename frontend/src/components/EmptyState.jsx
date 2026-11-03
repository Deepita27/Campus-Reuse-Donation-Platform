import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no records matching your current selection.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-campus-border shadow-subtle my-6 max-w-lg mx-auto">
      <div className="w-16 h-16 bg-campus-secondary/60 text-campus-primary rounded-full flex items-center justify-center mb-4 ring-8 ring-campus-secondary/20">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-campus-text mb-2">{title}</h3>
      <p className="text-campus-textMuted text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-campus-primary hover:bg-campus-primaryDark text-white font-medium rounded-xl text-sm transition shadow-sm hover:shadow"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-campus-primary hover:bg-campus-primaryDark text-white font-medium rounded-xl text-sm transition shadow-sm hover:shadow"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
