import express from 'express';
import User from '../models/User.js';
import Todo from '../models/Todo.js';
const router = express.Router();

router.get('/', async (req, res) => {
    try {        
        const todos = await Todo.find({ userId: req.user._id });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, completed, dueDate } = req.body;

    // 인증된 사용자의 ID를 가져옴
    const userId = req.user._id;

    try {
        const newTodo = new Todo({
            title,
            description,
            completed,
            dueDate,
            userId
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        console.error('Error creating Todo:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { title, description, completed, dueDate } = req.body;

    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, description, completed, dueDate },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;