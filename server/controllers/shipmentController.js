import Shipment from "../models/Shipment.js";
import Subscription from "../models/Subscription.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { sendTrackingEmail } from "../utils/sendEmail.js";
import { sendTrackingWhatsApp } from "../utils/sendWhatsApp.js";
import { createActivityLog, getRequestIp } from "../utils/activityLogger.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Create new shipment (Admin)
export const createShipment = async (req, res) => {
  try {
    const trackingNumber =
      req.body.trackingNumber ||
      `TRK-${uuidv4().substring(0, 8).toUpperCase()}`;
    const shipmentData = { ...req.body, trackingNumber };
    if (!shipmentData.status) {
      shipmentData.status = "Picked Up"; // Default initial status
    }
    const shipment = await Shipment.create(shipmentData);

    if (req.user) {
      await createActivityLog({
        performerId: req.user._id,
        actionType: 'CREATE_SHIPMENT',
        targetId: shipment.trackingNumber,
        details: `Created shipment ${shipment.trackingNumber}`,
        ipAddress: getRequestIp(req),
      });
    }

    res.status(201).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get shipment by tracking number (Public)
export const getShipmentByTracking = async (req, res) => {
  try {
    const rawTrackingId = String(req.params.id || "").trim();
    if (!rawTrackingId)
      return res.status(400).json({ message: "Invalid tracking identifier" });

    const trackingRegex = new RegExp(`^${escapeRegex(rawTrackingId)}$`, "i");
    const query = mongoose.Types.ObjectId.isValid(rawTrackingId)
      ? { $or: [{ _id: rawTrackingId }, { trackingNumber: trackingRegex }] }
      : { trackingNumber: trackingRegex };

    const shipment = await Shipment.findOne(query);
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });
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

      if (req.user) {
        await createActivityLog({
          performerId: req.user._id,
          actionType: 'DELETE_SHIPMENT',
          targetId: shipment.trackingNumber,
          details: `Deleted shipment ${shipment.trackingNumber}`,
          ipAddress: getRequestIp(req),
        });
      }

      res.json({ message: "Shipment removed" });
    } else {
      res.status(404).json({ message: "Shipment not found" });
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
    const delivered = await Shipment.countDocuments({ status: "Delivered" });
    const inTransit = await Shipment.countDocuments({ status: "In Transit" });
    const pending = await Shipment.countDocuments({ status: "Pending" });
    const delayed = await Shipment.countDocuments({ status: "Delayed" });

    // Calculate delivery rate percentage
    const deliveryRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : 0;

    res.json({
      total,
      delivered,
      inTransit,
      pending,
      delayed,
      deliveryRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const subscribeToShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const trackingRegex = new RegExp(`^${escapeRegex(String(id).trim())}$`, "i");
    const shipment = await Shipment.findOne({ trackingNumber: trackingRegex });

    if (!shipment) {
      return res
        .status(404)
        .json({ message: "Cannot subscribe: Shipment not found" });
    }

    await Subscription.create({
      email: String(email).toLowerCase().trim(),
      shipmentId: shipment.trackingNumber,
    });

    res
      .status(201)
      .json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You are already subscribed to this tracking ID." });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.aggregate([
      {
        $lookup: {
          from: "shipments",
          localField: "shipmentId",
          foreignField: "trackingNumber",
          as: "shipment",
        },
      },
      { $unwind: { path: "$shipment", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          email: 1,
          shipmentId: 1,
          subscribedAt: 1,
          "shipment.trackingNumber": 1,
          "shipment.productName": 1,
          "shipment.senderName": 1,
          "shipment.status": 1,
        },
      },
      { $sort: { subscribedAt: -1 } },
    ]);

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dispatchTrackingInfo = async (req, res) => {
  try {
    const { email, phone, trackingNumber, productName, method } = req.body;

    if (!method || !trackingNumber) {
      return res.status(400).json({ message: "Method and trackingNumber are required" });
    }

    if (method === "email") {
      if (!email) {
        return res.status(400).json({ message: "Email is required for email dispatch" });
      }
      await sendTrackingEmail(email, trackingNumber, productName);
    } else if (method === "whatsapp") {
      if (!phone) {
        return res.status(400).json({ message: "Phone is required for WhatsApp dispatch" });
      }
      await sendTrackingWhatsApp(phone, trackingNumber);
    } else {
      return res.status(400).json({ message: "Dispatch method must be email or whatsapp" });
    }

    res.json({ message: "Dispatched successfully!" });
  } catch (error) {
    console.error("Dispatch Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a specific status update/log from a shipment
export const deleteUpdate = async (req, res) => {
  try {
    const { shipmentId, updateId } = req.params;

    // 1. Find the parent shipment
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // 2. Pull the specific update from the 'updates' array
    const originalLength = shipment.updates.length;
    shipment.updates.pull({ _id: updateId });

    // 3. Check if anything actually changed
    if (shipment.updates.length === originalLength) {
      return res
        .status(404)
        .json({
          message:
            "Update log not found (it may have been created before the schema fix)",
        });
    }

    await shipment.save();
    res.json({ message: "Update removed successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: error.message });
  }
};
// controllers/shipmentController.js
export const addUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, description } = req.body;

    // 1. Find the shipment
    const shipment = await Shipment.findById(id);
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });

    // 2. Push the new update into the 'updates' array
    // Mongoose will automatically generate the _id for this sub-document
    shipment.updates.push({
      status,
      location,
      description,
      timestamp: new Date(),
    });

    // 3. Update the main shipment status to match the latest update
    shipment.status = status;
    shipment.currentLocation = location;

    await shipment.save();
    res.status(201).json(shipment);
  } catch (error) {
    console.error("Backend Error:", error);
    res
      .status(400)
      .json({ message: "Validation Failed", details: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const { email, shipmentId } = req.body;

    if (!email || !shipmentId) {
      return res.status(400).json({ message: "Email and shipmentId are required" });
    }

    const result = await Subscription.deleteOne({
      email: email.toLowerCase().trim(),
      shipmentId: shipmentId.trim().toUpperCase(),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (req.user) {
      await createActivityLog({
        performerId: req.user._id,
        actionType: 'DELETE_SUBSCRIPTION',
        targetId: shipmentId.trim().toUpperCase(),
        details: `Deleted subscription for ${email} on ${shipmentId}`,
        ipAddress: getRequestIp(req),
      });
    }

    res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Delete subscription error:", error);
    res.status(500).json({ message: error.message });
  }
};
