import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { FiMonitor, FiMoon, FiSun, FiTrash2 } from 'react-icons/fi';

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm space-y-8"
      >
        <section>
           <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
           <p className="text-sm text-gray-500 mb-4">Customize how the application looks on your device.</p>
           
           <div className="flex gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-blue-50 dark:bg-blue-900/10 text-primary' : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300'}`}
              >
                 <FiSun size={24} />
                 <span className="font-medium text-sm">Light</span>
              </button>
              
              <button 
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-blue-50 dark:bg-blue-900/10 text-primary' : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300'}`}
              >
                 <FiMoon size={24} />
                 <span className="font-medium text-sm">Dark</span>
              </button>

              <button 
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-blue-50 dark:bg-blue-900/10 text-primary' : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300'}`}
              >
                 <FiMonitor size={24} />
                 <span className="font-medium text-sm">System</span>
              </button>
           </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        <section>
           <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
           <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all associated data.</p>
           
           <button 
             onClick={() => window.alert('This feature is restricted for safety during this demo.')}
             className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
           >
             <FiTrash2 /> Delete Account
           </button>
        </section>
      </motion.div>
    </div>
  );
};

export default Settings;
