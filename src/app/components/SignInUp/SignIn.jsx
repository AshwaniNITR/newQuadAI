"use client";
import React, { useState } from 'react';
import {useRouter} from 'next/navigation';
export const SignIn = () => {
  // State to manage email, password, and any error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const Router=useRouter();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch('/api/Signin', { // Make sure the endpoint matches your back-end
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      Router.push('/home');
      if (!response.ok) {
        // If there's an error, set the error message
        setError(data.error);
      } else {
        // Handle successful login (e.g., redirect or display a success message)
        console.log(data.message);
        // Optionally, you can redirect to another page or do further actions
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#948534] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Optional: link to sign up page */}
          {/* <p className="mt-10 text-center text-sm text-gray-500">
            Not a member? <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign up</Link>
          </p> */}
        </div>
      </div>
    </>
  );
};
