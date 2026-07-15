import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShield, FiZap, FiGithub, FiTwitter } from 'react-icons/fi';

const About = () => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto pt-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white font-bold text-4xl shadow-xl mb-6">
          T
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Welcome to TodoSaaS
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          The ultimate productivity engine built for speed, designed with elegance, and engineered to help you achieve more every single day.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
           <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
             <FiZap size={24} />
           </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
           <p className="text-gray-500 text-sm">Experience zero lag with our highly optimized React 19 frontend and instantly updating dashboard.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
           <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4">
             <FiShield size={24} />
           </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
           <p className="text-gray-500 text-sm">Your tasks are securely encrypted with industry-standard JWT authentication and bcrypt hashing.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
           <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4">
             <FiCheckCircle size={24} />
           </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Beautiful Design</h3>
           <p className="text-gray-500 text-sm">A distraction-free, minimalist UI inspired by the world's leading enterprise SaaS tools.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 p-8 md:p-12 rounded-[24px] text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent dark:from-black"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to conquer your day?</h2>
          <p className="text-gray-300 dark:text-gray-600 mb-8 max-w-2xl mx-auto">
            TodoSaaS is currently at v1.0. We are constantly shipping new features. Keep building, keep shipping, and keep checking off those tasks.
          </p>
          <div className="flex items-center justify-center gap-4">
             <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 rounded-full transition-colors">
               <FiGithub size={20} />
             </a>
             <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 rounded-full transition-colors">
               <FiTwitter size={20} />
             </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
