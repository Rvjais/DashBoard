import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { config } from '../config/env.js';

const signupSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8).max(15),
  department: z.enum(['web','seo','social','graphics']).optional()
});

export const signup = async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const { name, phone, department = 'web' } = parsed.data;
  const username = name.trim();
  const password = phone.trim();
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, phone, username, passwordHash, department });
    res.status(201).json({ id: user._id, name: user.name, username, department });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'User already exists' });
    res.status(500).json({ message: 'Signup error', error: e.message });
  }
};

const loginSchema = z.object({
  phoneOrUsername: z.string().min(2),
  password: z.string().min(4),
});

export const login = async (req, res) => {
  const { phoneOrUsername, password } = req.body;
  const user = await User.findOne({
    $or: [{ phone: phoneOrUsername }, { username: phoneOrUsername }],
  });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  // ✅ include role & department in JWT
  const token = jwt.sign(
    {
      id: user._id,
      name: user.username,
      role: user.role,              // e.g. 'admin' or 'employee'
      department: user.department,  // e.g. 'web', 'seo', etc.
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // true in production (https)
  });

  // ✅ send user info to frontend
  res.json({
    id: user._id,
    name: user.username,
    role: user.role,
    department: user.department,
  });
};

