import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    location: { type: String, default: '' },
    description: { type: String, default: '' }, // Changed 'note' to 'description' to match your controller
    timestamp: { type: Date, default: Date.now },
  }
  // REMOVED { _id: false } -> We NEED the _id to delete specific updates!
);

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    senderName: { type: String, required: true },
    status: {
      type: String,
      required: true,
      // Ensure these match the options in your frontend dropdown
      enum: ['Picked Up', 'In Transit', 'Processing', 'Out for Delivery', 'Delivered', 'On Hold', 'Delayed', 'Pending'],
      default: 'Pending',
    },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    currentLocation: { type: String, default: '' },
    recipientName: { type: String, required: true },
    recipientEmail: { type: String, default: '' },
    weight: { type: String, default: '' },
    serviceType: { type: String, default: 'Standard' },
    estimatedDelivery: { type: String, default: '' },
    // Use 'updates' if that's what your controller uses, or update the controller to use 'events'
    updates: { type: [eventSchema], default: [] }, 
  },
  { timestamps: true }
);

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;