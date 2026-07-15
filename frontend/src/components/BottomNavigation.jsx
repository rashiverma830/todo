import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaTasks, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import toast from 'react-hot-toast';

const BottomNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('profile');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const userProfile = JSON.parse(localStorage.getItem('profile'))?.user;
  const userName = userProfile?.name || 'TodoApp';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="fixed bottom-0 left-0 right-0 md:static md:w-full md:h-full md:bg-white md:shadow-lg md:border-r border-t md:border-t-0 border-gray-100 bg-white/80 backdrop-blur-md px-6 py-4 md:py-8 flex md:flex-col justify-between md:justify-start items-center md:items-stretch rounded-t-3xl md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none z-50 md:gap-8">
      
      <div className="hidden md:flex items-center gap-3 mb-10 px-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
          {initial}
        </div>
        <span className="font-bold text-xl text-gray-800 truncate" title={userName}>{userName}</span>
      </div>

      <NavItem to="/" icon={<FaHome size={22} />} label="Dashboard" />
      <NavItem to="/tasks" icon={<FaTasks size={22} />} label="Tasks" />
      
      <div className="relative md:hidden -top-6">
        <button className="bg-primary text-white p-4 rounded-full shadow-glow hover:scale-105 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <div className="hidden md:block my-4">
        <button className="w-full bg-primary text-white p-3 rounded-2xl shadow-glow hover:scale-105 transition-transform flex justify-center items-center gap-2 font-medium">
          <span>+</span> Add Task
        </button>
      </div>
      
      <NavItem to="/calendar" icon={<FaCalendarAlt size={22} />} label="Calendar" />
      <NavItem to="/profile" icon={<FaUser size={22} />} label="Profile" />
      
      <div className="mt-auto hidden md:block pt-8">
        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-50 w-full transition-colors font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Logout</span>
        </button>
      </div>
      
      {/* Mobile Logout (optional, replacing profile for simplicity or adding nearby) */}
      <div className="md:hidden">
        <button onClick={handleLogout} className="text-red-400 hover:text-red-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink to={to} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-400 hover:text-primary transition-colors ${isActive ? 'text-primary md:bg-blue-50' : ''}`}>
    {icon}
    <span className="hidden md:block font-medium">{label}</span>
  </NavLink>
);

export default BottomNavigation;
