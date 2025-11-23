'use client';

import { useState } from 'react';
import { Link } from '@/lib/types';

interface LinkFormProps {
  onSuccess: (link: Link) => void;
}

export default function LinkForm({ onSuccess }: LinkFormProps) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({ url: false, code: false });
  const [validationErrors, setValidationErrors] = useState({ url: '', code: '' });

  const validateUrl = (urlValue: string): string => {
    if (!urlValue || !urlValue.trim()) {
      return 'URL is required';
    }
    try {
      const urlObj = new URL(urlValue.trim());
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }
    } catch {
      return 'Please enter a valid URL';
    }
    return '';
  };

  const validateCode = (codeValue: string): string => {
    if (codeValue && codeValue.length > 0) {
      if (codeValue.length < 6) {
        return 'Code must be at least 6 characters';
      }
      if (codeValue.length > 8) {
        return 'Code must be at most 8 characters';
      }
      if (!/^[A-Za-z0-9]+$/.test(codeValue)) {
        return 'Code must contain only letters and numbers';
      }
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    // Validate all fields
    const urlError = validateUrl(url);
    const codeError = validateCode(code);
    
    setValidationErrors({ url: urlError, code: codeError });
    setTouched({ url: true, code: true });
    
    if (urlError || codeError) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(), // Trim whitespace before sending
          code: code.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create link');
        return;
      }

      setSuccess(true);
      setUrl('');
      setCode('');
      setTouched({ url: false, code: false });
      setValidationErrors({ url: '', code: '' });
      onSuccess(data.link);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (touched.url) {
              setValidationErrors(prev => ({ ...prev, url: validateUrl(e.target.value) }));
            }
          }}
          onBlur={() => {
            setTouched(prev => ({ ...prev, url: true }));
            setValidationErrors(prev => ({ ...prev, url: validateUrl(url) }));
          }}
          placeholder="https://example.com"
          required
          className={`w-full px-3 py-2 text-gray-900 bg-white border rounded-md focus:outline-none focus:ring-2 ${
            touched.url && validationErrors.url
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } disabled:bg-gray-100 disabled:text-gray-500`}
          disabled={loading}
        />
        {touched.url && validationErrors.url && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.url}</p>
        )}
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          Custom Code <span className="text-gray-500 text-xs">(optional, 6-8 alphanumeric)</span>
        </label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => {
            const newValue = e.target.value.replace(/[^A-Za-z0-9]/g, '');
            setCode(newValue);
            if (touched.code) {
              setValidationErrors(prev => ({ ...prev, code: validateCode(newValue) }));
            }
          }}
          onBlur={() => {
            setTouched(prev => ({ ...prev, code: true }));
            setValidationErrors(prev => ({ ...prev, code: validateCode(code) }));
          }}
          placeholder="Leave empty for auto-generated"
          maxLength={8}
          pattern="[A-Za-z0-9]{6,8}"
          className={`w-full px-3 py-2 text-gray-900 bg-white border rounded-md focus:outline-none focus:ring-2 ${
            touched.code && validationErrors.code
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } disabled:bg-gray-100 disabled:text-gray-500`}
          disabled={loading}
        />
        {touched.code && validationErrors.code && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.code}</p>
        )}
        {code && !validationErrors.code && code.length > 0 && code.length < 6 && (
          <p className="text-xs text-gray-500 mt-1">Code must be at least 6 characters</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Link created successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !url}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Link'}
      </button>
    </form>
  );
}

