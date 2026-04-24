import Shipment from '../models/Shipment.js';
import { sendStatusEmail } from '../services/notificationService.js';

// @desc    Add tracking event (Admin)
export const addEvent = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.shipmentId);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    const newEvent = {
      status: req.body.status,
      location: req.body.location,
      note: req.body.note,
      timestamp: new Date()
    };

    // Update shipment state
    shipment.events.unshift(newEvent); 
    shipment.status = req.body.status;
    shipment.currentLocation = req.body.location;

    await shipment.save();

    // FIXED: Pass the actual instance data (email, ID, and new status)
    await sendStatusEmail(
      shipment.recipientEmail, 
      shipment.trackingId, 
      newEvent.status
    );

    res.status(200).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};