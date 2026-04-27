import ActivityLog from '../models/ActivityLog.js';

export const createActivityLog = async ({
  performerId,
  actionType,
  targetId = '',
  details = '',
  ipAddress = '',
}) => {
  return await ActivityLog.create({
    performerId,
    actionType,
    targetId,
    details,
    ipAddress,
  });
};

export const getRequestIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.connection?.remoteAddress ||
    req.ip ||
    ''
  );
};
