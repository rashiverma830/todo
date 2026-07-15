import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, signUp } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = isLogin ? await signIn(formData) : await signUp(formData);
      login(data);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-8 md:p-10">
             <div className="text-center mb-8">
               <div className="w-12 h-12 bg-primary text-white rounded-xl mx-auto flex items-center justify-center font-bold text-2xl shadow-lg mb-4">
                  T
               </div>
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                 {isLogin ? 'Welcome Back' : 'Create Account'}
               </h1>
               <p className="text-sm text-gray-500 mt-2">
                 {isLogin ? 'Enter your details to access your dashboard.' : 'Sign up to start managing your tasks efficiently.'}
               </p>
             </div>

             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input 
                        {...register('name')} 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all" 
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input 
                    {...register('email')} 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all" 
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input 
                    {...register('password')} 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all" 
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-md transition-all mt-4 disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    isLogin ? 'Sign In' : 'Sign Up'
                  )}
                </button>
             </form>
          </div>
          
          <div className="p-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 text-center">
             <p className="text-sm text-gray-600 dark:text-gray-400">
               {isLogin ? "Don't have an account? " : "Already have an account? "}
               <button onClick={toggleMode} className="text-primary font-semibold hover:underline">
                 {isLogin ? 'Sign Up' : 'Sign In'}
               </button>
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
