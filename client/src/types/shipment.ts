export type ShipmentStatus =
  | "Pending"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed"
  | "On Hold"
  | "Arrived at Hub";

export interface ShipmentEvent {
  status: ShipmentStatus;
  location: string;
  timestamp: string;
  note?: string;
}

export interface ShipmentUpdate {
  _id?: string;
  shipmentId: string;
  status: ShipmentStatus;
  location: string;
  timestamp: string;
  description: string;
}

export interface Shipment {
  _id?: string;
  trackingNumber: string;
  status: ShipmentStatus;
  currentLocation: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  recipientName: string;
  serviceType: string;
  weight: string;
  productName: string;
  senderName: string;
  events: ShipmentEvent[];
}