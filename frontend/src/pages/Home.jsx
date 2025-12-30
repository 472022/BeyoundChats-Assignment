import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import ArticleCard from '../components/ArticleCard';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles?limit=50');
        setArticles(response.data.articles);
      } catch (err) {
        setError('Failed to load articles. Please ensure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Extract unique categories
  const categories = ['All', ...new Set(articles.map(a => a.category).filter(Boolean))];

  // Filter articles
  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Articles</h1>
        <p className="text-gray-600 mb-6">Explore our collection of AI-curated content.</p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No articles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Home;
