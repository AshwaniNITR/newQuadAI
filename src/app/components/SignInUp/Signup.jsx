"use client";
import React, { useState, useEffect } from "react";

export const Signup = () => {
  const [timestamp, setTimestamp] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(timestamp);
    setTimestamp(new Date().toLocaleDateString());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Check Your Email!");
      } else {
        setError(data.error || "An error occurred during registration.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gradient-to-br from-blue-900/30 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl shadow-blue-900/20">
          <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Create your account
          </h2>
          
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-blue-100">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full rounded-lg bg-blue-900/30 border border-blue-500/30 px-4 py-3 text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent shadow-lg shadow-blue-900/20"
                    placeholder="username"
                  />
                </div>
              </div>

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
                  disabled={loading}
                  className={`flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-emerald-400/40 transition-all duration-300 hover:scale-[1.02] ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </form>

            {message && (
              <div className="mt-6 p-3 bg-emerald-900/30 border border-emerald-400/30 rounded-lg text-center text-emerald-200 animate-pulse">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-6 p-3 bg-red-900/30 border border-red-400/30 rounded-lg text-center text-red-200 animate-pulse">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};