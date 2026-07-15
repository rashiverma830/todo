import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTaskStats, fetchTodos } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle, FiClock, FiArchive, FiAlertCircle, FiList } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, archived: 0, highPriority: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, recentRes, upcomingRes] = await Promise.all([
          getTaskStats(),
          fetchTodos({ sort: 'newest' }), 
          fetchTodos({ sort: 'dueDate' })
        ]);
        
        setStats(statsRes.data);
        
        setRecentTasks(recentRes.data.slice(0, 5));
        const futureTasks = upcomingRes.data.filter(t => t.dueDate && new Date(t.dueDate) >= new Date());
        setUpcomingTasks(futureTasks.slice(0, 5));
      } catch (error) {
        console.error("Dashboard data load error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
         <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3"></div>
         <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
           {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>)}
         </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="p-6 md:p-10 max-w-7xl mx-auto space-y-10"
    >
      {/* Header section */}
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{currentDate}</p>
        </div>
        
        {/* Global Progress Indicator */}
        <div className="flex items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl px-5 py-3 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
           <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Completion</span>
           <div className="w-40 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              />
           </div>
           <span className="text-sm font-bold text-gray-900 dark:text-white">{completionPercentage}%</span>
        </div>
      </motion.header>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={<FiList />} 
          color="text-blue-600 dark:text-blue-400" 
          bg="bg-blue-50 dark:bg-blue-500/10"
          border="border-blue-100 dark:border-blue-500/20"
          percentage={100}
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={<FiCheckCircle />} 
          color="text-emerald-600 dark:text-emerald-400" 
          bg="bg-emerald-50 dark:bg-emerald-500/10"
          border="border-emerald-100 dark:border-emerald-500/20"
          percentage={stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}
        />
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          icon={<FiClock />} 
          color="text-amber-600 dark:text-amber-400" 
          bg="bg-amber-50 dark:bg-amber-500/10"
          border="border-amber-100 dark:border-amber-500/20"
          percentage={stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}
        />
        <StatCard 
          title="High Priority" 
          value={stats.highPriority} 
          icon={<FiAlertCircle />} 
          color="text-rose-600 dark:text-rose-400" 
          bg="bg-rose-50 dark:bg-rose-500/10"
          border="border-rose-100 dark:border-rose-500/20"
          percentage={stats.total ? Math.round((stats.highPriority / stats.total) * 100) : 0}
        />
        <StatCard 
          title="Archived" 
          value={stats.archived} 
          icon={<FiArchive />} 
          color="text-gray-600 dark:text-gray-400" 
          bg="bg-gray-100 dark:bg-gray-500/10"
          border="border-gray-200 dark:border-gray-500/20"
          percentage={stats.total ? Math.round((stats.archived / stats.total) * 100) : 0}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8 pt-4">
        {/* Recent Tasks */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm overflow-hidden transition-colors">
            {recentTasks.length === 0 ? (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400 font-medium">No recent tasks.</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {recentTasks.map(task => (
                  <TaskListItem key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Upcoming Deadlines</h2>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm overflow-hidden transition-colors">
            {upcomingTasks.length === 0 ? (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400 font-medium">No upcoming tasks scheduled.</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {upcomingTasks.map(task => (
                  <TaskListItem key={task._id} task={task} showDate />
                ))}
              </div>
            )}
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color, bg, border, percentage }) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-5 rounded-[20px] border ${border} shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group relative overflow-hidden`}
  >
    {/* Subtle gradient background effect on hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-transparent to-current ${color}`} />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-6">
         <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
           {React.cloneElement(icon, { size: 20 })}
         </div>
         <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{percentage}%</span>
         </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
          {value}
        </h3>
        <span className="text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase tracking-widest">{title}</span>
      </div>
      
      {/* Mini Progress Bar */}
      <div className="mt-4 w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-').split(' ')[0]}`}
        />
      </div>
    </div>
  </motion.div>
);

const TaskListItem = ({ task, showDate }) => {
  return (
    <motion.div 
      whileHover={{ backgroundColor: "rgba(156, 163, 175, 0.05)" }}
      className="p-5 flex items-center justify-between gap-4 cursor-default"
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
            task.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
            task.status === 'In Progress' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' : 
            'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20'
          }`}>
            {task.status}
          </span>
          {task.isArchived && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20">
              Archived
            </span>
          )}
        </div>
        
        <div className="truncate">
          <p className={`font-semibold text-sm truncate transition-colors ${task.status === 'Completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{task.category}</span>
            {task.priority === 'High' && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">High Priority</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {showDate && task.dueDate && (
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 shadow-sm">
          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
