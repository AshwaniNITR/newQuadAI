"use client";
import React, { useState, useEffect } from "react";

export const Signup = () => {
  const [timestamp, setTimestamp] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    setTimestamp(new Date().toLocaleDateString()); // Set timestamp on client side
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setError(""); // Clear previous errors
    setLoading(true); // Set loading to true when the process starts

    try {
      const response = await fetch("/api/Signup", {
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
      setLoading(false); // Set loading to false when the process ends
    }
  };

  return (
    <>
      <div className={`flex min-h-full flex-col justify-center px-6 py-8 lg:px-8`}>
        <div className={`sm:mx-auto sm:w-full sm:max-w-sm`}>
          <h2 className={`text-center text-2xl font-bold leading-9 tracking-tight text-white`}>
            Sign Up to your account
          </h2>
        </div>

        <div className={`mt-10 sm:mx-auto sm:w-full sm:max-w-sm`}>
          <form onSubmit={handleSubmit} className={`space-y-6`}>
            <div>
              <label htmlFor="username" className={`block text-sm font-medium leading-6 text-white`}>
                Username
              </label>
              <div className={`mt-2`}>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium leading-6 text-white`}>
                Email address
              </label>
              <div className={`mt-2`}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium leading-6 text-white`}>
                Password
              </label>
              <div className={`mt-2`}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div>
              <button
                disabled={loading} // Disable button when loading
                className={`flex w-full justify-center rounded-md bg-[#948534] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {loading ? "Signing Up..." : "Sign Up"} {/* Change button text based on loading state */}
              </button>
            </div>
          </form>

          {message && <p className={`mt-4 text-center text-green-500`}>{message}</p>}
          {error && <p className={`mt-4 text-center text-red-500`}>{error}</p>}
        </div>
      </div>
    </>
  );
};
