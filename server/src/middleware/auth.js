import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function auth(req, res, next) {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, name, role }
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// (Optional) also provide a default export if you ever want `import auth from ...`
export default auth;
