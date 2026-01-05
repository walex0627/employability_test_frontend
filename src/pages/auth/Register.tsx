import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

/**
 * Register Component
 * Simplified form for creating a new account.
 */
const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/register', { name, email, password, role: 'coder' });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
      <div className="w-full max-w-sm border border-gray-200 p-8 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Register</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-red-500 text-sm border border-red-200 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              required
              className="border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-black font-semibold underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;