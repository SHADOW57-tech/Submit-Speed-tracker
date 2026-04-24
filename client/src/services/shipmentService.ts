import { API } from "./api";
import { Shipment } from "@/types/shipment";

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