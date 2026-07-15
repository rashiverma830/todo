import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateUser } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Profile = () => {
  const { user, fetchUser } = useAuth();
  
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const { register: registerName, handleSubmit: handleNameSubmit, formState: { errors: nameErrors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '' }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onNameSubmit = async (data) => {
    setLoadingName(true);
    try {
      await updateUser({ name: data.name });
      toast.success('Display name updated');
      await fetchUser();
    } catch (error) {
      toast.error('Failed to update name');
    } finally {
      setLoadingName(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoadingPassword(true);
    try {
      await updateUser({ password: data.password });
      toast.success('Password updated securely');
      resetPassword();
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Manage your account settings and preferences.</p>
      </div>
      
      <div className="space-y-8">
        
        {/* Avatar Section */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
           <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-semibold text-2xl text-gray-900 dark:text-white shrink-0">
                {userInitial}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Avatar</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md">This is your avatar. Currently, avatars are automatically generated from your display name.</p>
              </div>
           </div>
           <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500">
             An avatar is optional but strongly recommended.
           </div>
        </section>

        {/* Display Name Section */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
           <form onSubmit={handleNameSubmit(onNameSubmit)}>
             <div className="p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Display Name</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md">Please enter your full name, or a display name you are comfortable with.</p>
                
                <div className="max-w-md">
                   <input 
                     {...registerName('name')} 
                     type="text" 
                     className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all sm:text-sm"
                   />
                   {nameErrors.name && <p className="text-red-500 text-sm mt-2">{nameErrors.name.message}</p>}
                </div>
             </div>
             <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
               <span className="text-sm text-gray-500">Please use 32 characters at maximum.</span>
               <button 
                 type="submit" 
                 disabled={loadingName}
                 className="px-4 py-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
               >
                 {loadingName ? 'Saving...' : 'Save'}
               </button>
             </div>
           </form>
        </section>

        {/* Email Address Section */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
           <div className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email Address</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md">The email address associated with your account.</p>
              
              <div className="max-w-md">
                 <input 
                   type="email" 
                   value={user?.email || ''} 
                   disabled
                   className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-500 dark:text-gray-400 sm:text-sm cursor-not-allowed"
                 />
              </div>
           </div>
           <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500">
             We will email you to verify the change.
           </div>
        </section>

        {/* Password Section */}
        <section className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/30 rounded-xl overflow-hidden shadow-sm">
           <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
             <div className="p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Change Password</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md">Update your password to keep your account secure.</p>
                
                <div className="max-w-md">
                   <input 
                     {...registerPassword('password')} 
                     type="password"
                     placeholder="New Password"
                     className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all sm:text-sm"
                   />
                   {passwordErrors.password && <p className="text-red-500 text-sm mt-2">{passwordErrors.password.message}</p>}
                </div>
             </div>
             <div className="bg-red-50/50 dark:bg-red-900/10 px-6 py-4 border-t border-red-100 dark:border-red-900/30 flex justify-between items-center">
               <span className="text-sm text-gray-500 dark:text-gray-400">Use a password at least 6 characters long.</span>
               <button 
                 type="submit" 
                 disabled={loadingPassword}
                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
               >
                 {loadingPassword ? 'Updating...' : 'Update Password'}
               </button>
             </div>
           </form>
        </section>

      </div>
    </div>
  );
};

export default Profile;
