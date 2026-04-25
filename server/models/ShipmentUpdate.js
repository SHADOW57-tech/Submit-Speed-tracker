import mongoose from 'mongoose';

const shipmentUpdateSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Transit', 'Arrived at Hub', 'Out for Delivery', 'Delivered', 'On Hold', 'Delayed'],
    },
    location: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const ShipmentUpdate = mongoose.model('ShipmentUpdate', shipmentUpdateSchema);
export default ShipmentUpdate;