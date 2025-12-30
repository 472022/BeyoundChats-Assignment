import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import { ArrowLeft, ExternalLink, Calendar, User, Loader2 } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('enhanced'); // 'original' or 'enhanced'

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${id}`);
        setArticle(response.data);
        // Default to original if not updated
        if (!response.data.is_updated) {
          setActiveTab('original');
        }
      } catch (err) {
        setError('Article not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Article not found'}</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Back to Home</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Articles
        </Link>
      </div>

      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Badge isUpdated={article.is_updated} />
            <span className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(article.published_date || article.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center text-gray-600">
              <User className="w-5 h-5 mr-2 bg-gray-100 rounded-full p-1" />
              <span className="font-medium">{article.author || 'Unknown Author'}</span>
            </div>
            <a 
              href={article.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              View Source <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        {/* Tabs */}
        {article.is_updated && (
          <div className="flex border-b border-gray-200 bg-gray-50/50">
            <button
              onClick={() => setActiveTab('enhanced')}
              className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'enhanced'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              ✨ AI Enhanced Version
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'original'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              📄 Original Version
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <div className="prose prose-blue max-w-none">
            {activeTab === 'enhanced' && article.is_updated ? (
              <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                 {/* 
                    Note: Ideally use a Markdown renderer like 'react-markdown' here.
                    For now, we display plain text but preserving whitespace.
                 */}
                 {article.updated_content}
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: article.original_content_html || article.original_content_text }} />
            )}
          </div>
        </div>

        {/* References Footer (Only for Enhanced View) */}
        {activeTab === 'enhanced' && article.references && article.references.length > 0 && (
          <div className="bg-gray-50 p-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">References & Citations</h3>
            <ul className="space-y-2">
              {article.references.map((ref, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2">{index + 1}.</span>
                  <a 
                    href={ref} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all text-sm"
                  >
                    {ref}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </Layout>
  );
};

export default ArticleDetail;
