'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Link } from '@/lib/types';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async (isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
        }
        const response = await fetch(`/api/links/${code}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Link not found');
          return;
        }

        setLink(data.link);
        setError('');
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        if (isInitial) {
          setLoading(false);
        }
      }
    };

    if (code) {
      fetchLink(true);
      
      // Auto-refresh link stats every 3 seconds to show updated click counts
      const interval = setInterval(() => {
        fetchLink(false);
      }, 3000);
      
      // Refresh when page gains focus (user comes back to tab)
      const handleFocus = () => {
        fetchLink(false);
      };
      window.addEventListener('focus', handleFocus);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [code]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    } else if (process.env.NEXT_PUBLIC_APP_URL) {
      setBaseUrl(process.env.NEXT_PUBLIC_APP_URL);
    }
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading link statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Link Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested link does not exist.'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const shortUrl = baseUrl ? `${baseUrl}/${link.code}` : `/${link.code}`;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Link Statistics</h1>
          <p className="text-gray-600">Details for code: <span className="font-mono font-semibold">{link.code}</span></p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Short Code</h2>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono font-semibold text-gray-900">{link.code}</span>
              <button
                onClick={() => copyToClipboard(shortUrl, 'short')}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200 flex items-center gap-2"
                title="Copy short URL"
              >
                {copiedId === 'short' ? (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Short URL</h2>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {shortUrl}
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Target URL</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {link.url}
              </a>
              <button
                onClick={() => copyToClipboard(link.url, 'url')}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200 flex items-center gap-2"
                title="Copy original URL"
              >
                {copiedId === 'url' ? (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Total Clicks</h2>
              <p className="text-3xl font-bold text-gray-900">{link.clicks}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Last Clicked</h2>
              <p className="text-lg text-gray-900">{formatDate(link.lastClicked)}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Created At</h2>
              <p className="text-lg text-gray-900">{formatDate(link.createdAt)}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete link "${link.code}"?`)) {
                  fetch(`/api/links/${link.code}`, { method: 'DELETE' })
                    .then(() => router.push('/'))
                    .catch(() => alert('Failed to delete link'));
                }
              }}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Delete Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

