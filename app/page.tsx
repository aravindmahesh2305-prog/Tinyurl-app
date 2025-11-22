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
    if (!confirm(`Are you sure you want to delete link "${code}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete link');
        return;
      }

      // Remove from local state
      setLinks(links.filter((link) => link.code !== code));
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TinyLink</h1>
          <p className="text-gray-600">Shorten your URLs and track clicks</p>
        </header>

        <div className="mb-8">
          <LinkForm onSuccess={fetchLinks} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Links</h2>
          
          {loading && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
              Loading links...
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

