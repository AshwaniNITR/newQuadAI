"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const Router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/Signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      Router.push('/home');
      if (!response.ok) {
        setError(data.error);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gradient-to-br from-blue-900/30 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl shadow-blue-900/20">
          <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Sign in to your account
          </h2>
          {error && <p className="text-red-400 text-center mt-4 animate-pulse">{error}</p>}

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-100">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-lg bg-blue-900/30 border border-blue-500/30 px-4 py-3 text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent shadow-lg shadow-blue-900/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-100">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-lg bg-blue-900/30 border border-blue-500/30 px-4 py-3 text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent shadow-lg shadow-blue-900/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-emerald-400/40 transition-all duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};