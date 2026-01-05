import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Login Component
 * Provides a basic, clean interface for user authentication.
 */
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) navigate('/dashboard', {replace: true});
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
      <div className="w-full max-w-sm border border-gray-200 p-8 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Login</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-red-500 text-sm border border-red-200 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Email address</label>
            <input
              type="email"
              required
              className="border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              required
              className="border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white p-2 rounded font-medium hover:bg-gray-800 transition-all mt-2"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          New here?{' '}
          <Link to="/register" className="text-black font-semibold underline">
            Register as Coder
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;