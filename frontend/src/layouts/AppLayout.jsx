import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiHome, FiCheckSquare, FiClock, FiArchive, FiSettings, FiUser, FiLogOut, FiMoon, FiSun, FiList } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AppLayout = () => {
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { to: '/', icon: <FiHome />, label: 'Dashboard' },
    { to: '/tasks', icon: <FiList />, label: 'All Tasks' },
    { to: '/tasks?status=Completed', icon: <FiCheckSquare />, label: 'Completed' },
    { to: '/tasks?status=Pending', icon: <FiClock />, label: 'Pending' },
    { to: '/tasks?isArchived=true', icon: <FiArchive />, label: 'Archived' },
  ];

  const bottomNavItems = [
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
    { to: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col justify-between hidden md:flex z-20 shadow-sm"
      >
        <div>
          <NavLink to="/about" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity outline-none">
             <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-md">
               {userInitial}
             </div>
             <span className="font-semibold text-lg tracking-tight">TodoSaaS</span>
          </NavLink>
          
          <nav className="px-4 mt-2 space-y-1">
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Overview</div>
             {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                      isActive && item.to === window.location.pathname + window.location.search 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-200'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
             ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <nav className="space-y-1 mb-4">
            {bottomNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                      isActive 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
             ))}
          </nav>

          <div className="flex items-center justify-between px-3 py-2">
            <button onClick={toggleTheme} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
               {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button onClick={logout} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Logout">
               <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <Outlet />
      </main>
      
      {/* Mobile Nav would go here, omitting for brevity/cleanliness, assuming desktop first focus for SaaS, but can add later */}
    </div>
  );
};

export default AppLayout;
