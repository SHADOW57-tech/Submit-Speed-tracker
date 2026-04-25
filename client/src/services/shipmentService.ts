import { API } from "./api";
import type { Shipment, ShipmentUpdate } from "@/types/shipment";

export const getShipment = async (id: string) => {
  const res = await API.get(`/shipments/${id}`);
  return res.data;
};

export const createShipment = async (data: Shipment) => {
  const res = await API.post("/shipments", data);
  return res.data;
};

export const getAllShipments = async () => {
  const res = await API.get("/shipments");
  return res.data;
};

export const addUpdate = async (shipmentId: string, updateData: Omit<ShipmentUpdate, 'shipmentId' | 'timestamp'>) => {
  const res = await API.post(`/shipments/${shipmentId}/updates`, updateData);
  return res.data;
};

export const getUpdates = async (shipmentId: string) => {
  const res = await API.get(`/shipments/${shipmentId}/updates`);
  return res.data;
};

export const deleteUpdate = async (updateId: string) => {
  const res = await API.delete(`/updates/${updateId}`);
  return res.data;
};