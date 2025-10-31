import WorkUpdate from "../models/WorkUpdate.js";

// Create a work update (uses the authenticated user)
export const createWork = async (req, res) => {
  const { title, description, status, metric, value } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const isAdmin = req.user.role === 'admin';
  const targetDept = req.body.department || req.user.department;
  if (!isAdmin && targetDept !== req.user.department) {
    return res.status(403).json({ message: 'You can only post updates to your own department' });
  }

  const work = await WorkUpdate.create({
    userId: req.user.id, department: targetDept, title: title.trim(),
    description: description || '', status: status || 'in-progress',
    metric, value: value || 1,
  });
  res.status(201).json(work);
};


// Get currently logged-in user's work updates
export const myWork = async (req, res) => {
  try {
    const list = await WorkUpdate.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(list);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch work", error: err.message });
  }
};
