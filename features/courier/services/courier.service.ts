import { courierShipments, getShipmentByOrderId } from "@/data/couriers";
import type { CourierShipment } from "@/types/misc";
import { sleep } from "@/lib/utils";

export interface CourierService {
  list(): Promise<CourierShipment[]>;
  getByOrderId(orderId: string): Promise<CourierShipment | null>;
  getByTrackingId(trackingId: string): Promise<CourierShipment | null>;
}

export const mockCourierService: CourierService = {
  async list() {
    await sleep(300);
    return courierShipments;
  },
  async getByOrderId(orderId) {
    await sleep(250);
    return getShipmentByOrderId(orderId) ?? null;
  },
  async getByTrackingId(trackingId) {
    await sleep(250);
    return courierShipments.find((s) => s.trackingId === trackingId) ?? null;
  },
};

export const courierService: CourierService = mockCourierService;
