'use client';

import { useState, useMemo, useEffect } from 'react';
import { Link } from '@/lib/types';

interface LinkTableProps {
  links: Link[];
  onDelete: (code: string) => void;
}

type SortField = 'code' | 'url' | 'clicks' | 'lastClicked' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function LinkTable({ links, onDelete }: LinkTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  // Get base URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    } else if (process.env.NEXT_PUBLIC_APP_URL) {
      setBaseUrl(process.env.NEXT_PUBLIC_APP_URL);
    }
  }, []);

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedLinks = useMemo(() => {
    let filtered = links;

    // Filter by search term
    if (searchTerm) {
      filtered = links.filter(
        (link) =>
          link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'lastClicked' || sortField === 'createdAt') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [links, searchTerm, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-400">↕</span>;
    return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  if (links.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
        <p>No links yet. Create your first short link above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by code or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('code')}
              >
                <div className="flex items-center gap-2">
                  Code <SortIcon field="code" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('url')}
              >
                <div className="flex items-center gap-2">
                  Target URL <SortIcon field="url" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('clicks')}
              >
                <div className="flex items-center gap-2">
                  Clicks <SortIcon field="clicks" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('lastClicked')}
              >
                <div className="flex items-center gap-2">
                  Last Clicked <SortIcon field="lastClicked" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedLinks.map((link) => {
              const shortUrl = baseUrl ? `${baseUrl}/${link.code}` : `/${link.code}`;
              return (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/code/${link.code}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {link.code}
                      </a>
                      <button
                        onClick={() => copyToClipboard(shortUrl)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy short URL"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900" title={link.url}>
                        {truncateUrl(link.url)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(link.url)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy original URL"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(link.lastClicked)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onDelete(link.code)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSortedLinks.length === 0 && searchTerm && (
        <div className="p-8 text-center text-gray-500">
          No links match your search.
        </div>
      )}
    </div>
  );
}

