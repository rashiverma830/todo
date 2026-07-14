const Todo = require('../models/Todo');

exports.createTodo = async (req, res) => {
    try {
        const todo = new Todo({ ...req.body, userId: req.userId });
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo' });
    }
};

exports.getTodos = async (req, res) => {
    try {
        const { search, category, priority, sortBy } = req.query;
        let query = { userId: req.userId };

        if (search) query.title = { $regex: search, $options: 'i' };
        if (category) query.category = category;
        if (priority) query.priority = priority;

        let sortOption = { createdAt: -1 };
        if (sortBy === 'dueDate') sortOption = { dueDate: 1 };

        const todos = await Todo.find(query).sort(sortOption);
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos' });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, { new: true });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo' });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ _id: id, userId: req.userId });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo' });
    }
};
