import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiPlus, FiSearch, FiFilter, FiMoreVertical, FiCheck, FiTrash2, FiEdit2, FiArchive, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchTodos, createTodo, updateTodo, deleteTodo, bulkDeleteTasks, duplicateTask } from '../services/api';
import { useSearchParams } from 'react-router-dom';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  category: z.string().default('Personal'),
  status: z.enum(['Pending', 'In Progress', 'Completed']).default('Pending'),
  dueDate: z.string().optional(),
});

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortParam, setSortParam] = useState('newest');
  
  // Selection State
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const initialStatus = searchParams.get('status') || '';
  const initialArchived = searchParams.get('isArchived') === 'true';

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema)
  });

  const loadTasks = async () => {
    setLoading(true);
    try {
      const { data } = await fetchTodos({ 
        sort: sortParam,
        ...(initialStatus && { status: initialStatus }),
        ...(initialArchived && { isArchived: true })
      });
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [sortParam, initialStatus, initialArchived]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const onSubmit = async (data) => {
    try {
      if (editingTask) {
        await updateTodo(editingTask._id, data);
        toast.success('Task updated');
      } else {
        await createTodo(data);
        toast.success('Task created');
      }
      setIsModalOpen(false);
      reset();
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteTodo(id);
      toast.success('Task deleted');
      loadTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await updateTodo(task._id, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      loadTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const toggleSelection = (id) => {
    const newSet = new Set(selectedTasks);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedTasks(newSet);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedTasks.size} tasks?`)) return;
    try {
      await bulkDeleteTasks(Array.from(selectedTasks));
      toast.success('Tasks deleted');
      setSelectedTasks(new Set());
      loadTasks();
    } catch (error) {
      toast.error('Failed to delete tasks');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 px-6 flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="flex items-center w-full md:w-auto gap-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {initialArchived ? 'Archived Tasks' : (initialStatus || 'All Tasks')}
            </h1>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-800 rounded-lg text-sm outline-none transition-all"
              />
            </div>
         </div>

         <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={sortParam}
              onChange={(e) => setSortParam(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primary"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="a-z">A-Z</option>
            </select>

            <button 
              onClick={() => { reset(); setEditingTask(null); setIsModalOpen(true); }}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FiPlus /> New Task
            </button>
         </div>
      </div>

      {/* Bulk Actions Banner */}
      <AnimatePresence>
        {selectedTasks.size > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900 px-6 py-2 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">{selectedTasks.size} selected</span>
            <button onClick={handleBulkDelete} className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1 hover:underline">
              <FiTrash2 /> Delete Selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
             <FiCheckCircle size={48} className="mb-4 opacity-20" />
             <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No tasks found</p>
             <p className="text-sm">Create a new task to get started.</p>
          </div>
        ) : (
          <div className="space-y-2 max-w-5xl mx-auto">
            {filteredTasks.map(task => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={task._id}
                className={`group flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  selectedTasks.has(task._id) 
                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedTasks.has(task._id)}
                  onChange={() => toggleSelection(task._id)}
                  className="mt-1.5 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                
                <button 
                  onClick={() => handleToggleStatus(task)}
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.status === 'Completed' 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                  }`}
                >
                  {task.status === 'Completed' && <FiCheck size={12} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium truncate ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                      {task.title}
                    </h3>
                    {task.priority === 'High' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">HIGH</span>}
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{task.category}</span>
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button onClick={() => openEditModal(task)} className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingTask ? 'Edit Task' : 'Create Task'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input {...register('title')} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white" />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea {...register('description')} rows={3} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <select {...register('priority')} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select {...register('status')} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white">
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <input {...register('category')} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                    <input type="date" {...register('dueDate')} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors shadow-sm">
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
