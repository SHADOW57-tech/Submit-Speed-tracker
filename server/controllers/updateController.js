import ShipmentUpdate from '../models/ShipmentUpdate.js';
import Shipment from '../models/Shipment.js';

// @desc    Add update to shipment
// @route   POST /api/shipments/:id/updates
// @access  Private (Admin)
export const addUpdate = async (req, res) => {
  try {
    const { status, location, description } = req.body;
    const trackingId = req.params.id; // This is the tracking number string

    // 1. Verify shipment exists by searching for trackingNumber
    const shipment = await Shipment.findOne({ trackingNumber: trackingId });
    
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // 2. Create the update using the shipment's internal _id
    const update = await ShipmentUpdate.create({
      shipmentId: shipment._id, // Use the actual MongoDB ID here
      status,
      location,
      description,
    });

    // 3. Update the shipment's current status and location
    shipment.status = status;
    shipment.currentLocation = location;
    await shipment.save();

    res.status(201).json(update);
  } catch (error) {
    // If it's a cast error, we provide a clearer message
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all updates for a shipment
// @route   GET /api/shipments/:id/updates
// @access  Public
export const getUpdates = async (req, res) => {
  try {
    const trackingId = req.params.id;

    // 1. First find the shipment to get its internal _id
    const shipment = await Shipment.findOne({ trackingNumber: trackingId });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // 2. Find updates linked to that internal _id
    const updates = await ShipmentUpdate.find({ shipmentId: shipment._id })
      .sort({ timestamp: -1 });
      
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an update
// @route   DELETE /api/updates/:id
// @access  Private (Admin)
export const deleteUpdate = async (req, res) => {
  try {
    // Note: Delete usually uses the specific Update's unique _id, 
    // so findById is usually fine here as long as the frontend sends the _id.
    const update = await ShipmentUpdate.findById(req.params.id);
    if (update) {
      await update.deleteOne();
      res.json({ message: 'Update removed' });
    } else {
      res.status(404).json({ message: 'Update not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};