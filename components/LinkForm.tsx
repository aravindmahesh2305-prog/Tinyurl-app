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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-5">
      <div className="space-y-2">
        <label htmlFor="url" className="block text-sm font-semibold text-gray-700">
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
          className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
            touched.url && validationErrors.url
              ? 'border-red-400 focus:ring-red-300 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-300 focus:border-blue-500'
          } disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
          disabled={loading}
        />
        {touched.url && validationErrors.url && (
          <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {validationErrors.url}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="code" className="block text-sm font-semibold text-gray-700">
          Custom Code <span className="text-gray-500 text-xs font-normal">(optional, 6-8 alphanumeric)</span>
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
          className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
            touched.code && validationErrors.code
              ? 'border-red-400 focus:ring-red-300 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-300 focus:border-blue-500'
          } disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
          disabled={loading}
        />
        {touched.code && validationErrors.code && (
          <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {validationErrors.code}
          </p>
        )}
        {code && !validationErrors.code && code.length > 0 && code.length < 6 && (
          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Code must be at least 6 characters
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r-lg flex items-start gap-3 animate-slide-in">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-r-lg flex items-start gap-3 animate-slide-in">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Success!</p>
            <p className="text-sm">Link created successfully!</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !url}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        ) : (
          'Create Short Link'
        )}
      </button>
    </form>
  );
}

