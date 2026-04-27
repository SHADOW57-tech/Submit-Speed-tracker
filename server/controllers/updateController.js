import mongoose from 'mongoose';
import ShipmentUpdate from '../models/ShipmentUpdate.js';
import Shipment from '../models/Shipment.js';
import { createActivityLog, getRequestIp } from '../utils/activityLogger.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildTrackingQuery = (trackingId) => {
  const normalized = String(trackingId || '').trim();
  const trackingRegex = new RegExp(`^${escapeRegex(normalized)}$`, 'i');
  return mongoose.Types.ObjectId.isValid(normalized)
    ? { $or: [{ _id: normalized }, { trackingNumber: trackingRegex }] }
    : { trackingNumber: trackingRegex };
};

// Define your Status Mapping
const SHIPMENT_STATUSES = [
  'Picked Up',      // Index 0
  'In Transit',     // Index 1
  'Processing',    // Index 2
  'Out for Delivery', // Index 3
  'Delivered'       // Index 4
];

// @desc    Add update to shipment
// @route   POST /api/shipments/:id/updates
// @access  Private (Admin)
export const addUpdate = async (req, res) => {
  try {
    const { status, location, description } = req.body;
    const trackingId = req.params.id; // This is the tracking number string

    console.log('Add update request:', { trackingId, status, location, description });

    // 1. Verify shipment exists by searching using a robust tracking query
    const shipment = await Shipment.findOne(buildTrackingQuery(trackingId));
    
    if (!shipment) {
      console.log('Shipment not found for tracking ID:', trackingId);
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // 2. Validate required fields
    if (!location || !location.trim()) {
      return res.status(400).json({ message: 'Location is required' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // 3. Create the update using the shipment's internal _id
    const update = await ShipmentUpdate.create({
      shipmentId: shipment._id, // Use the actual MongoDB ID here
      status,
      location: location.trim(),
      description: description || '',
    });

    // 4. Update the shipment's current status and location
    shipment.status = status;
    shipment.currentLocation = location.trim();
    await shipment.save();

    if (req.user) {
      await createActivityLog({
        performerId: req.user._id,
        actionType: 'UPDATE_STATUS',
        targetId: shipment.trackingNumber,
        details: `Added update ${status} for ${shipment.trackingNumber}`,
        ipAddress: getRequestIp(req),
      });
    }

    console.log('Update created successfully:', update._id);
    res.status(201).json(update);
  } catch (error) {
    console.error('Add update error:', error);
    // If it's a cast error, we provide a clearer message
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    // If it's a validation error, return the specific field errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
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

    // 1. First find the shipment using a robust tracking query
    const shipment = await Shipment.findOne(buildTrackingQuery(trackingId));

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
// @route   DELETE /api/shipments/:id/updates/:updateId
// @access  Private (Admin)
export const deleteUpdate = async (req, res) => {
  try {
    const { id: shipmentTrackingId, updateId } = req.params;
    console.log('Delete request - Tracking ID:', shipmentTrackingId, 'Update ID:', updateId);

    // Step 1: Find shipment by tracking number
    const shipment = await Shipment.findOne(buildTrackingQuery(shipmentTrackingId));
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Step 2: Try to delete from ShipmentUpdate collection (newer schema)
    const deletedFromCollection = await ShipmentUpdate.findByIdAndDelete(updateId);

    // Step 3: Also try to delete from embedded updates array (older schema)
    const originalLength = shipment.updates?.length || 0;
    if (shipment.updates) {
      shipment.updates.pull({ _id: updateId });
    }
    const newLength = shipment.updates?.length || 0;
    const deletedFromEmbedded = newLength < originalLength;

    if (!deletedFromCollection && !deletedFromEmbedded) {
      console.log('Update not found in collection or embedded array');
      return res.status(404).json({
        message: 'Update log not found (it may have been created before the schema fix)'
      });
    }

    // Save only if we deleted from embedded updates
    if (deletedFromEmbedded) {
      await shipment.save();
    }

    if (req.user) {
      await createActivityLog({
        performerId: req.user._id,
        actionType: 'DELETE_UPDATE',
        targetId: shipment.trackingNumber,
        details: `Deleted update ${updateId} for ${shipment.trackingNumber}`,
        ipAddress: getRequestIp(req),
      });
    }

    console.log('Update deleted successfully');
    res.json({ message: 'Update removed' });
  } catch (error) {
    console.error('Delete update error:', error);
    res.status(500).json({ message: error.message });
  }
};