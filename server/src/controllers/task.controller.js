import Task from '../models/Task.js';

// Admin: create task for any department
export const createTask = async (req, res) => {
  const { title, description='', department, assignee, dueDate } = req.body;
  if (!title || !department) return res.status(400).json({ message: 'title and department are required' });
  const t = await Task.create({ title, description, department, assignee, dueDate });
  res.status(201).json(t);
};

// Admin: get all tasks (optionally filter ?department=web)
export const listAllTasks = async (req, res) => {
  const q = {};
  if (req.query.department) q.department = req.query.department;
  const list = await Task.find(q).sort({ createdAt: -1 }).populate('assignee', 'name department');
  res.json(list);
};

// Employee/Manager: list tasks for my department
export const listMyDeptTasks = async (req, res) => {
  const list = await Task.find({ department: req.user.department })
    .sort({ createdAt: -1 })
    .populate('assignee', 'name department');
  res.json(list);
};

// Employee/Manager: update status or add feedback (only within own dept, unless admin)
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Not found' });

  const isAdmin = req.user.role === 'admin';
  if (!isAdmin && task.department !== req.user.department) {
    return res.status(403).json({ message: 'Not allowed for other departments' });
  }

  const { status, feedbackMessage } = req.body;
  if (status) task.status = status;
  if (feedbackMessage && feedbackMessage.trim()) {
    task.feedback.push({ userId: req.user.id, message: feedbackMessage.trim() });
  }
  await task.save();
  const populated = await Task.findById(task._id).populate('assignee', 'name department');
  res.json(populated);
};
