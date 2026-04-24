import Shipment from "../models/Shipment.js";
import { v4 as uuidv4 } from "uuid";

// @desc    Create new shipment (Admin)
export const createShipment = async (req, res) => {
  try {
    const trackingNumber = req.body.trackingNumber || `TRK-${uuidv4().substring(0, 8).toUpperCase()}`;
    const shipment = await Shipment.create({ ...req.body, trackingNumber });
    res.status(201).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get shipment by tracking number (Public)
export const getShipmentByTracking = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.id });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all shipments (Admin Dashboard)
export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete shipment
export const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (shipment) {
      await shipment.deleteOne();
      res.json({ message: 'Shipment removed' });
    } else {
      res.status(404).json({ message: 'Shipment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shipment analytics
// @route   GET /api/shipments/stats/analytics
export const getAnalytics = async (req, res) => {
  try {
    const total = await Shipment.countDocuments();
    const delivered = await Shipment.countDocuments({ status: 'Delivered' });
    const inTransit = await Shipment.countDocuments({ status: 'In Transit' });
    const pending = await Shipment.countDocuments({ status: 'Pending' });
    const delayed = await Shipment.countDocuments({ status: 'Delayed' });

    // Calculate delivery rate percentage
    const deliveryRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : 0;

    res.json({
      total,
      delivered,
      inTransit,
      pending,
      delayed,
      deliveryRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};