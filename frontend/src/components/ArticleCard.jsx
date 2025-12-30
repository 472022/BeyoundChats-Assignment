import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import Badge from './Badge';

const ArticleCard = ({ article }) => {
  const formattedDate = new Date(article.published_date || article.created_at).toLocaleDateString();

  return (
    <Link to={`/article/${article.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <Badge isUpdated={article.is_updated} />
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formattedDate}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2">
            {article.title}
          </h3>
          
          <div className="text-gray-600 text-sm line-clamp-3 mb-4">
             {/* Simple truncation for preview */}
             {article.original_content_text?.substring(0, 150)}...
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span className="truncate max-w-[150px]">{article.author || 'Unknown Author'}</span>
          </div>
          <span className="text-blue-600 text-sm font-medium group-hover:underline">Read more &rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
