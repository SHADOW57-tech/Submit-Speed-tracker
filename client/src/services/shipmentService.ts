import { API } from "./api";
import type { Shipment } from "@/types/shipment";

export const getShipment = async (id: string) => {
  // Use encodeURIComponent to handle tracking numbers with special characters/spaces
  const res = await API.get(`/shipments/${encodeURIComponent(id)}`);
  return res.data;
};

export const createShipment = async (data: Partial<Shipment>) => {
  const res = await API.post("/shipments", data);
  return res.data;
};

export const getAllShipments = async () => {
  const res = await API.get("/shipments");
  return res.data;
};

/**
 * FIX: Use the 'API' instance instead of raw axios to ensure base URLs match.
 * Ensure the status string exactly matches your Mongoose Enum.
 */
export const addUpdate = async (
  shipmentId: string, 
  updateData: { status: string; location: string; description: string }
) => {
  // Remove timestamp - backend handles this automatically
  const payload = {
    status: updateData.status,
    location: updateData.location,
    description: updateData.description,
  };

  const res = await API.post(`/shipments/${shipmentId}/updates`, payload);
  return res.data;
};

export const getUpdates = async (shipmentId: string) => {
  const res = await API.get(`/shipments/${shipmentId}/updates`);
  return res.data;
};

export const deleteUpdate = async (shipmentId: string, updateId: string) => {
  // Matches the backend: /api/shipments/:shipmentId/updates/:updateId
  const res = await API.delete(`/shipments/${shipmentId}/updates/${updateId}`);
  return res.data;
};