import nodemailer from 'nodemailer';

export const sendTrackingEmail = async (email, trackingNumber, productName = '') => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your Shipment Tracking Information - ${trackingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Shipment Tracking Information</h2>
          <p>Dear Customer,</p>
          <p>Your shipment${productName ? ` for ${productName}` : ''} is now being tracked.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #007bff;">Tracking Number: ${trackingNumber}</h3>
            <p style="margin-bottom: 0;">
              <a href="${process.env.FRONTEND_URL}/track/${trackingNumber}"
                 style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Track Your Shipment
              </a>
            </p>
          </div>
          <p>You will receive updates as your shipment progresses through our system.</p>
          <p>Best regards,<br>SUBMIT SPEED Team</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Tracking email sent successfully');
  } catch (error) {
    console.error('Error sending tracking email:', error);
    throw new Error('Failed to send tracking email');
  }
};