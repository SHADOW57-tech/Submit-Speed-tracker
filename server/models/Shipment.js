import Shipment from '../models/Shipment.js';

export const getShipmentMetrics = async () => {
  const total = await Shipment.countDocuments();
  const transit = await Shipment.countDocuments({ status: 'In Transit' });
  const delivered = await Shipment.countDocuments({ status: 'Delivered' });
  return { total, transit, delivered };
};

export default getShipmentMetrics;