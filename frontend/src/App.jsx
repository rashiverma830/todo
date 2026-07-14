import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import BottomNavigation from './components/BottomNavigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen pb-20 bg-background max-w-md mx-auto shadow-2xl relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          {/* Add more routes like login, register, profile, etc. */}
        </Routes>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
