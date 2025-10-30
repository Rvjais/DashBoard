import WorkUpdate from '../models/WorkUpdate.js';

// Create a work update (uses the authenticated user)
export const createWork = async (req, res) => {
  try {
    const { title, description = '', status = 'in-progress' } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

    const doc = await WorkUpdate.create({
      userId: req.user.id,
      department: req.body.department || req.user.department || 'web',
      title: title.trim(),
      description,
      status
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create work', error: err.message });
  }
};

// Get currently logged-in user's work updates
export const myWork = async (req, res) => {
  try {
    const list = await WorkUpdate
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch work', error: err.message });
  }
};
