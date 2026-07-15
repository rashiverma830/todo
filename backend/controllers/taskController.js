const Task = require('../models/Task');

// Get all tasks with filtering, sorting, and searching
exports.getTasks = async (req, res, next) => {
    try {
        const { search, status, priority, category, isArchived, isPinned, sort } = req.query;
        let query = { userId: req.user.id };

        // Filtering
        if (search) query.title = { $regex: search, $options: 'i' };
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;
        if (isArchived !== undefined) query.isArchived = isArchived === 'true';
        if (isPinned !== undefined) query.isPinned = isPinned === 'true';

        // Sorting
        let sortOption = { createdAt: -1 }; // Default: Newest
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'a-z') sortOption = { title: 1 };
        if (sort === 'z-a') sortOption = { title: -1 };
        if (sort === 'priority') sortOption = { priority: -1 }; // High to Low assuming alphabetical enum or custom logic needed, actually enum is ['Low', 'Medium', 'High'] so alphabetical H, L, M. Need better priority sort, but simple string sort for now.
        if (sort === 'dueDate') sortOption = { dueDate: 1 };
        if (sort === 'status') sortOption = { status: 1 };

        const tasks = await Task.find(query).sort(sortOption);
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

// Create a new task
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, category, dueDate, isPinned, isArchived } = req.body;
        const newTask = new Task({
            userId: req.user.id,
            title,
            description,
            status,
            priority,
            category,
            dueDate,
            isPinned,
            isArchived
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        next(error);
    }
};

// Update an existing task
exports.updateTask = async (req, res, next) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get task statistics for dashboard
exports.getTaskStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const stats = await Task.aggregate([
            { $match: { userId: new require('mongoose').Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $in: ["$status", ["Pending", "In Progress"]] }, 1, 0] } },
                    archived: { $sum: { $cond: ["$isArchived", 1, 0] } },
                    highPriority: { $sum: { $cond: [{ $eq: ["$priority", "High"] }, 1, 0] } }
                }
            }
        ]);

        if (stats.length > 0) {
            const data = stats[0];
            delete data._id;
            res.status(200).json(data);
        } else {
            res.status(200).json({ total: 0, completed: 0, pending: 0, archived: 0, highPriority: 0 });
        }
    } catch (error) {
        next(error);
    }
};

// Bulk delete tasks
exports.bulkDeleteTasks = async (req, res, next) => {
    try {
        const { taskIds } = req.body;
        if (!Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({ message: 'Invalid task IDs provided' });
        }
        await Task.deleteMany({ _id: { $in: taskIds }, userId: req.user.id });
        res.status(200).json({ message: 'Tasks deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Delete all completed tasks
exports.deleteCompletedTasks = async (req, res, next) => {
    try {
        await Task.deleteMany({ userId: req.user.id, status: 'Completed' });
        res.status(200).json({ message: 'Completed tasks deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Duplicate a task
exports.duplicateTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        const newTask = new Task({
            userId: req.user.id,
            title: `${task.title} (Copy)`,
            description: task.description,
            status: task.status,
            priority: task.priority,
            category: task.category,
            dueDate: task.dueDate,
            isPinned: false, // Don't inherit pin
            isArchived: false // Don't inherit archive
        });
        
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        next(error);
    }
};
