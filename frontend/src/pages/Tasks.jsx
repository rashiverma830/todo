import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 pt-12 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full shadow-sm text-gray-700">
          <FiArrowLeft size={20} />
        </button>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl shadow-glow font-medium flex items-center gap-2">
          <span>+</span> Add Task
        </button>
      </div>

      {/* Calendar Strip */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-3xl shadow-sm">
        <Day date="11" day="Mon" />
        <Day date="12" day="Tue" />
        <Day date="13" day="Wed" />
        <Day date="14" day="Thu" active />
        <Day date="15" day="Fri" />
        <Day date="16" day="Sat" />
        <Day date="17" day="Sun" />
      </div>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gray-200"></div>
        
        <div className="flex flex-col gap-6">
          <TimelineItem 
            title="Wireframing" 
            time="12:00 PM" 
            desc="Make some ideation from sketch and wireframes." 
            color="bg-rose-500 text-white" 
            active
          />
          <TimelineItem 
            title="UI Design" 
            time="1:30 PM" 
            desc="Visual design from the wireframe and make design system." 
            color="bg-indigo-50 text-indigo-900" 
          />
          <TimelineItem 
            title="Prototyping" 
            time="3:00 PM" 
            desc="Make the interactive prototype for the testing & stakeholders." 
            color="bg-orange-50 text-orange-900" 
          />
          <TimelineItem 
            title="Usability Testing" 
            time="3:45 PM" 
            desc="Primary user testing and usability testing of the prototype." 
            color="bg-emerald-50 text-emerald-900" 
          />
          <TimelineItem 
            title="Meeting" 
            time="4:30 PM" 
            desc="Sum up discussion for the new product with stakeholders." 
            color="bg-pink-50 text-pink-900" 
          />
        </div>
      </div>
    </div>
  );
};

const Day = ({ date, day, active }) => (
  <div className={`flex flex-col items-center gap-1 ${active ? 'text-primary' : 'text-gray-400'}`}>
    <span className="text-xs font-medium">{day}</span>
    <span className={`text-sm font-bold ${active ? 'bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-glow' : ''}`}>
      {date}
    </span>
    {active && <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>}
  </div>
);

const TimelineItem = ({ title, time, desc, color, active }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="relative pl-8"
  >
    {/* Timeline Dot */}
    <div className="absolute left-[-21px] top-4 w-4 h-4 bg-white border-4 border-rose-400 rounded-full z-10 shadow-[0_0_0_4px_rgba(255,255,255,1)]"></div>
    {active && <div className="absolute left-[-27px] top-[10px] w-7 h-7 border border-rose-400 rounded-full z-0 opacity-50"></div>}

    <div className={`p-5 rounded-3xl ${color} shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold">{title}</h4>
        <span className="text-sm font-medium opacity-80">{time}</span>
      </div>
      <p className="text-sm opacity-90 leading-snug">{desc}</p>
    </div>
  </motion.div>
);

export default Tasks;
