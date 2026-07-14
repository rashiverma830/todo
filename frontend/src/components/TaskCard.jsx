import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const TaskCard = ({ task, onToggle, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-xl shadow-soft mb-4 flex items-center justify-between cursor-pointer ${task.completed ? 'bg-gray-50' : 'bg-card'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <button onClick={(e) => { e.stopPropagation(); onToggle(task._id); }} className="text-2xl text-primary">
          {task.completed ? <FaCheckCircle className="text-secondary" /> : <FaRegCircle className="text-gray-300" />}
        </button>
        <div>
          <h4 className={`font-semibold ${task.completed ? 'line-through text-textMuted' : 'text-textMain'}`}>{task.title}</h4>
          <p className="text-sm text-textMuted">{task.dueDate || 'No due date'}</p>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
        {task.priority}
      </div>
    </motion.div>
  );
};

export default TaskCard;
