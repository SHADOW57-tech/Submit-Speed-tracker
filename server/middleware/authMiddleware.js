import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        return res.status(401).json({ message: 'Server configuration error: JWT_SECRET not set' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

const normalizeRole = (role) => String(role || '').toLowerCase();

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const role = normalizeRole(req.user.role);
  if (role !== 'admin' && role !== 'owner') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

const ownerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const role = normalizeRole(req.user.role);
  if (role !== 'owner') {
    return res.status(403).json({ message: 'Owner access required' });
  }

  next();
};

export { protect, adminOnly, ownerOnly };