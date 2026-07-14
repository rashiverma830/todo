import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
      <NavItem to="/" icon={<FaHome size={22} />} />
      <NavItem to="/tasks" icon={<FaTasks size={22} />} />
      <div className="relative -top-6">
        <button className="bg-primary text-white p-4 rounded-full shadow-glow hover:scale-105 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
      <NavItem to="/calendar" icon={<FaCalendarAlt size={22} />} />
      <NavItem to="/profile" icon={<FaUser size={22} />} />
    </div>
  );
};

const NavItem = ({ to, icon }) => (
  <NavLink to={to} className={({ isActive }) => `text-gray-400 hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}>
    {icon}
  </NavLink>
);

export default BottomNavigation;
