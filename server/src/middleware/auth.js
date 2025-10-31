import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

/**
 * Middleware: authenticate the user based on JWT token.
 * Looks for token in cookies OR Authorization header (Bearer <token>)
 */
export const auth = (req, res, next) => {
  try {
    // 1️⃣  Try to read token from cookie
    let token = req.cookies?.token;

    // 2️⃣  Fallback: check Authorization header
    if (!token && req.headers.authorization) {
      const header = req.headers.authorization;
      if (header.startsWith("Bearer ")) {
        token = header.slice(7); // remove "Bearer "
      }
    }

    // 3️⃣  If no token found, deny access
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    // 4️⃣  Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // 5️⃣  Attach decoded user info to request
    req.user = decoded;

    // 6️⃣  Continue to next middleware/route
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
