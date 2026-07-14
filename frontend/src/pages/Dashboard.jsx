import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMenu } from 'react-icons/fi';

const Dashboard = () => {
  return (
    <div className="p-6 pt-12 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button className="p-3 bg-white rounded-full shadow-sm text-gray-700">
          <FiMenu size={20} />
        </button>
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm overflow-hidden">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-gray-500 font-medium text-lg">Good Morning, Rifat!</h2>
        <h1 className="text-3xl font-bold text-textMain mt-1 leading-tight">
          You have <span className="text-primary">49 tasks</span><br />this month 👍
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-8 shadow-sm rounded-2xl overflow-hidden">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" size={20} />
        </div>
        <input 
          type="text" 
          className="w-full pl-12 pr-4 py-4 bg-white border-none focus:ring-2 focus:ring-primary outline-none text-gray-700 rounded-2xl" 
          placeholder="Search a task...." 
        />
      </div>

      {/* Status Icons */}
      <div className="flex justify-between mb-10 px-2">
        <StatusIcon color="bg-pink-100 text-pink-500" icon="📋" label="To-Do" />
        <StatusIcon color="bg-yellow-100 text-yellow-500" icon="⏳" label="Progress" />
        <StatusIcon color="bg-green-100 text-green-500" icon="✅" label="Done" />
      </div>

      {/* Today's Tasks */}
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-2xl font-bold text-textMain">Today's Tasks</h3>
        <button className="text-sm text-gray-400 font-medium hover:text-primary">See All</button>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6">
        <TaskWidget 
          title="Team Meeting 👥" 
          desc="Group discussion for the new product." 
          time="10:00 AM" 
          progress={48} 
          bgClass="bg-gradient-to-br from-indigo-500 to-blue-600"
        />
        <TaskWidget 
          title="UI Design 🎨" 
          desc="Make a homepage the olakart app" 
          time="11:00 AM" 
          progress={72} 
          bgClass="bg-gradient-to-br from-pink-500 to-rose-500"
        />
      </div>
    </div>
  );
};

const StatusIcon = ({ color, icon, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm ${color} bg-white border-4 border-transparent bg-clip-padding relative`}>
        <div className={`absolute inset-0 rounded-full opacity-20 ${color.split(' ')[0]}`}></div>
        {icon}
    </div>
    <span className="text-sm font-semibold text-gray-700">{label}</span>
  </div>
);

const TaskWidget = ({ title, desc, time, progress, bgClass }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`min-w-[240px] p-5 rounded-[32px] text-white shadow-lg relative overflow-hidden ${bgClass}`}
  >
    {/* Decorative circles */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>
    
    <div className="relative z-10">
      <h4 className="font-bold text-xl mb-1">{title}</h4>
      <p className="text-white/80 text-sm mb-4 leading-snug">{desc}</p>
      
      <div className="text-sm font-semibold mb-6">
        {time}
      </div>
      
      <div>
        <div className="flex justify-between text-xs font-semibold mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default Dashboard;
