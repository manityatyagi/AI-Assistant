import Task from '../models/task.model.js';

const getTasks = async (req, res) => {
  try {
    const items = await Task.find({}).sort({ createdAt: -1 });
    if(!items) {
      return res.status(404).json({ 
        message: 'No tasks found' 
      });
    }
    const payload = items.map(t => ({ 
      id: String(t._id), 
      text: t.text, 
      completed: t.completed 
    }));
    
    res.status(200).json(payload);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    res.status(500).json({ 
      message: 'Failed to fetch tasks'
    });
  }
};

const addTask = async (req, res) => {
  try {
    const { text } = req.body;
    const item = await Task.create({ text });
    if(!item) {
      return res.status(400).json({ 
        message: 'Failed to add task' 
      });
    }

    res.status(201).json({ 
      id: String(item._id), 
      text: item.text, 
      completed: item.completed 
    });
  } catch (error) {
    console.error('Failed to add task:', error);
    res.status(500).json({ 
      message: 'Failed to add task' 
    });
  }
};

const toggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Task.findById(id);
    if (!item) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }

    item.completed = !item.completed;
    await item.save();
    
    res.status(200).json({ 
      id: String(item._id), 
      completed: item.completed 
    });
  } catch (error) {
    console.error('Failed to toggle task:', error);
    res.status(500).json({ 
      message: 'Failed to toggle task' 
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    
    res.status(204).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error('Failed to delete task:', error);
    res.status(500).json({ 
      message: 'Failed to delete task' 
    });
  }
};

export { getTasks, addTask, toggleTask, deleteTask };