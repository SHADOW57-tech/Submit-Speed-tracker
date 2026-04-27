import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendTrackingWhatsApp = async (phone, trackingNumber) => {
  try {
    // Ensure phone number is in international format
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+')) {
      // If no country code, assume Nigeria (+234) as default
      formattedPhone = `+234${formattedPhone.replace(/^0/, '')}`;
    }

    const message = await client.messages.create({
      body: `🚚 SUBMIT SPEED Tracking Update\n\nYour shipment is now being tracked!\n\nTracking Number: ${trackingNumber}\n\nTrack here: ${process.env.FRONTEND_URL}/track/${trackingNumber}\n\nYou will receive updates as your shipment progresses.`,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${formattedPhone}`,
    });

    console.log('WhatsApp message sent successfully:', message.sid);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw new Error('Failed to send WhatsApp message');
  }
};