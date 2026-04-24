import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    location: { type: String, default: '' },
    note: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Transit', 'Delivered', 'On Hold', 'Delayed'],
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
    events: { type: [eventSchema], default: [] },
  },
  { timestamps: true }
);

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;