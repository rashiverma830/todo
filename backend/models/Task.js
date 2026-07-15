const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending', index: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    category: { type: String, default: 'Personal' },
    dueDate: { type: Date },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
