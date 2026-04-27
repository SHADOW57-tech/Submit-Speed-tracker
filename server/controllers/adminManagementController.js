import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { getRequestIp } from '../utils/activityLogger.js';

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'owner'] } })
      .select('-password')
      .sort({ role: -1, createdAt: 1 });

    res.json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const toggleAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Owner access required' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'owner') {
      return res.status(403).json({ message: 'Cannot modify owner role' });
    }

    const previousRole = targetUser.role;
    targetUser.role = targetUser.role === 'admin' ? 'user' : 'admin';
    await targetUser.save();

    await ActivityLog.create({
      performerId: req.user._id,
      actionType: 'TOGGLE_ADMIN_STATUS',
      targetId: String(targetUser._id),
      details: `Changed ${targetUser.email} role from ${previousRole} to ${targetUser.role}`,
      ipAddress: getRequestIp(req),
    });

    res.json({
      message: `User role updated to ${targetUser.role}`,
      user: {
        _id: targetUser._id,
        email: targetUser.email,
        role: targetUser.role,
        name: targetUser.name,
        phone: targetUser.phone,
      },
    });
  } catch (error) {
    console.error('Toggle admin status error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getSystemLogs = async (req, res) => {
  try {
    const { adminName, startDate, endDate } = req.query;

    const filters = {};
    if (adminName) {
      filters['performer.name'] = new RegExp(adminName.toString(), 'i');
    }
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate.toString());
      if (endDate) filters.createdAt.$lte = new Date(endDate.toString());
    }

    const logs = await ActivityLog.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'performerId',
          foreignField: '_id',
          as: 'performer',
        },
      },
      { $unwind: '$performer' },
      { $match: filters },
      {
        $project: {
          performerId: 1,
          actionType: 1,
          targetId: 1,
          details: 1,
          ipAddress: 1,
          createdAt: 1,
          'performer._id': 1,
          'performer.name': 1,
          'performer.email': 1,
          'performer.role': 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json(logs);
  } catch (error) {
    console.error('Get system logs error:', error);
    res.status(500).json({ message: error.message });
  }
};
