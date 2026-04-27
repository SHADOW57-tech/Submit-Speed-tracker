import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true 
  },
  shipmentId: { 
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  subscribedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Prevent duplicate subscriptions for the same shipment
subscriptionSchema.index({ email: 1, shipmentId: 1 }, { unique: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;