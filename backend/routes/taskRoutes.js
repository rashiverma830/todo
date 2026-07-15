const express = require('express');
const { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    getTaskStats, 
    bulkDeleteTasks, 
    deleteCompletedTasks,
    duplicateTask 
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/stats', getTaskStats);
router.post('/bulk-delete', bulkDeleteTasks);
router.delete('/completed', deleteCompletedTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/duplicate', duplicateTask);

module.exports = router;
