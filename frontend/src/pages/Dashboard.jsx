import React, { useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { Play, Loader2, Terminal, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState({ scrape: false, enhance: false });

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const handleProcess = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    addLog(`Starting ${type} process...`, 'info');

    try {
      const response = await api.post(`/admin/${type}`);
      
      if (response.data.success) {
        addLog(`${type.toUpperCase()} Completed Successfully!`, 'success');
        addLog('--- OUTPUT LOGS ---');
        // Split output by newlines and add to logs
        const outputLines = response.data.logs.split('\n').filter(Boolean);
        outputLines.forEach(line => addLog(line));
      } else {
        addLog(`Process failed: ${response.data.message}`, 'error');
      }
    } catch (error) {
      addLog(`Error connecting to server: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulation Dashboard</h1>
        <p className="text-gray-600">Trigger background processes and monitor their execution in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Scraper Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">Phase 1</span>
              Blog Scraper
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Scrapes the 5 oldest articles from BeyondChats and populates the database.
            </p>
            <button
              onClick={() => handleProcess('scrape')}
              disabled={loading.scrape || loading.enhance}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading.scrape ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading.scrape ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Start Scraper</>
              )}
            </button>
          </div>

          {/* Enhancer Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">Phase 2</span>
              AI Enhancer
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Uses Google Search & Gemini AI to research and rewrite pending articles.
            </p>
            <button
              onClick={() => handleProcess('enhance')}
              disabled={loading.scrape || loading.enhance}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading.enhance ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {loading.enhance ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Start AI Enhancement</>
              )}
            </button>
          </div>

        </div>

        {/* Log Console */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 h-[600px] flex flex-col overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center text-gray-300 text-sm font-mono">
                <Terminal className="w-4 h-4 mr-2" />
                Process Output Log
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1">
              {logs.length === 0 ? (
                <div className="text-gray-600 italic">Waiting for process initiation...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-green-400 break-words border-b border-gray-800/30 pb-1">
                    <span className="text-gray-500 mr-2">&gt;</span>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
