import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

/**
 * Navbar Component
 * Displays the application title, current user information, and logout functionality.
 */
const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Clears session data and redirects to login.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">Riwi Jobs</span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-3 border-r pr-6 border-gray-100">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-blue-600">
              <UserIcon size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-none">{user.name}</span>
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider mt-1">
                {user.role}
              </span>
            </div>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-semibold text-sm transition-colors group"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;