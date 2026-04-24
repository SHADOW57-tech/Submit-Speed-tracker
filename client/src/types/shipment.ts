export type ShipmentStatus =
  | "Pending"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed"
  | "On Hold";

export interface ShipmentEvent {
  status: ShipmentStatus;
  location: string;
  timestamp: string;
  note?: string;
}

export interface Shipment {
  trackingNumber: string;
  status: ShipmentStatus;
  currentLocation: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  recipientName: string;
  serviceType: string;
  weight: string;
  events: ShipmentEvent[];
}