'use client';

import { useState, useEffect } from 'react';
import LinkForm from '@/components/LinkForm';
import LinkTable from '@/components/LinkTable';
import { Link } from '@/lib/types';

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch links');
        return;
      }

      setLinks(data.links || []);
      setError('');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm(`Are you sure you want to delete link "${code}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        window.alert(data.error || 'Failed to delete link');
        return;
      }

      setLinks(links.filter((link) => link.code !== code));
    } catch (err) {
      window.alert('Network error. Please try again.');
    }
  };

  useEffect(() => {
    fetchLinks();
    
    const handleFocus = () => {
      fetchLinks();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
            TinyLink
          </h1>
          <p className="text-gray-600 text-lg">Shorten your URLs and track clicks with ease</p>
        </header>

        <div className="mb-8">
          <LinkForm onSuccess={fetchLinks} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Links</h2>
          
          {loading && (
            <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600 font-medium">Loading links...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && (
            <LinkTable links={links} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}

