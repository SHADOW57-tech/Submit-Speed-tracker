// server/services/notificationService.js

/**
 * Sends a status update notification
 * @param {string} email - Recipient email
 * @param {string} trackingId - The SS-XXX tracking number
 * @param {string} status - The new status (e.g., 'In Transit')
 */
export const sendStatusEmail = async (email, trackingId, status) => {
  try {
    // For now, we log to console. 
    // In production, you'd use Nodemailer or SendGrid here.
    console.log(`-----------------------------------------------`);
    console.log(`📢 NOTIFICATION SENT TO: ${email}`);
    console.log(`📦 SHIPMENT: ${trackingId}`);
    console.log(`✅ NEW STATUS: ${status}`);
    console.log(`-----------------------------------------------`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to send notification:", error);
    return { success: false };
  }
};