'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'idle'|'verifying'|'success'|'error'>('idle');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setError('No verification token provided');
        return;
      }

      setStatus('verifying');

      try {
        const response = await fetch(`/api/auth/verify?token=${token}`, {
          headers: {
            'Accept': 'application/json', // Explicitly request JSON
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setStatus('success');
        
        // Redirect after delay
        setTimeout(() => {
          // Use window.location for full page reload to ensure cookies are read
          window.location.href = data.redirectTo || '/';
        }, 3000);

      } catch (err) {
        setStatus('error');
        setError(
          err instanceof Error 
            ? err.message 
            : 'An unknown error occurred during verification'
        );
      }
    };

    verifyToken();
  }, [searchParams]);

  const renderStatus = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Verifying your email</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Please wait while we verify your email address...</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Verification successful!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your email has been verified successfully. You will be redirected shortly.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Verification failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  {error.includes('expired') && (
                    <p className="mt-2">
                      <Link href="/resend-verification" className="font-medium text-red-600 hover:text-red-500">
                        Click here to request a new verification email
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {renderStatus()}
          <div className="text-center text-sm text-gray-600 mt-4">
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}