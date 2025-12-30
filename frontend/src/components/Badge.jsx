import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Badge = ({ isUpdated }) => {
  if (isUpdated) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        AI Enhanced
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      <AlertCircle className="w-3 h-3 mr-1" />
      Original
    </span>
  );
};

export default Badge;
