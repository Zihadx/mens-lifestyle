import { orders, getOrderById, getOrdersByCustomerId } from "@/data/orders";
import type { Order, OrderItem } from "@/types/order";
import type { OrderStatus, PaymentStatus } from "@/lib/business-logic";
import { isOrderCancellable, ORDER_STATUS_FLOW, getOrderStatusLabel } from "@/lib/business-logic";
import type { CheckoutAddress, PaymentMethod } from "@/types/cart";
import type { Paginated, PaginationParams } from "@/types/service";
import { ServiceError } from "@/types/service";
import { sleep } from "@/lib/utils";

export interface OrderQuery extends PaginationParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string; // matches order number, customer name, or phone
  customerId?: string;
}

export interface CreateOrderInput {
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  address: CheckoutAddress;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  customerNotes?: string;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
}

export interface OrderService {
  list(query: OrderQuery): Promise<Paginated<Order>>;
  getById(id: string): Promise<Order | null>;
  getByCustomerId(customerId: string): Promise<Order[]>;
  create(input: CreateOrderInput): Promise<Order>;
  updateStatus(id: string, status: OrderStatus, note?: string): Promise<Order>;
  cancel(id: string, reason: string): Promise<Order>;
  refund(id: string, reason: string): Promise<Order>;
}

// In-memory mutable copy so create/update actions feel real within a session
// (a page refresh resets it — this is a preview, not real persistence).
const orderStore: Order[] = [...orders];

function paginate<T>(list: T[], { page = 1, pageSize = 10 }: PaginationParams): Paginated<T> {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), page: safePage, pageSize, total, totalPages };
}

export const mockOrderService: OrderService = {
  async list(query) {
    await sleep(300);
    let result = [...orderStore].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (query.status) result = result.filter((o) => o.status === query.status);
    if (query.paymentStatus) result = result.filter((o) => o.paymentStatus === query.paymentStatus);
    if (query.customerId) result = result.filter((o) => o.customerId === query.customerId);
    if (query.search) {
      const term = query.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(term) ||
          o.customerName.toLowerCase().includes(term) ||
          o.customerPhone.includes(term)
      );
    }

    return paginate(result, query);
  },

  async getById(id) {
    await sleep(250);
    return orderStore.find((o) => o.id === id) ?? null;
  },

  async getByCustomerId(customerId) {
    await sleep(250);
    return orderStore.filter((o) => o.customerId === customerId);
  },

  async create(input) {
    await sleep(600); // simulate order placement + stock reservation
    const id = `ord_${String(orderStore.length + 1).padStart(4, "0")}`;
    const orderNumber = `VR${String(100000 + orderStore.length)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id,
      orderNumber,
      customerId: input.customerId,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      items: input.items,
      subtotal: input.subtotal,
      discount: input.discount,
      deliveryCharge: input.deliveryCharge,
      total: input.total,
      couponCode: input.couponCode,
      address: input.address,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "cod" ? "cod-pending" : "pending",
      status: "pending",
      timeline: [{ status: "pending", label: getOrderStatusLabel("pending"), timestamp: now }],
      customerNotes: input.customerNotes,
      createdAt: now,
      updatedAt: now,
    };

    orderStore.unshift(newOrder);
    return newOrder;
  },

  async updateStatus(id, status, note) {
    await sleep(300);
    const order = orderStore.find((o) => o.id === id);
    if (!order) throw new ServiceError(`Order ${id} not found`, "not-found");

    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({ status, label: getOrderStatusLabel(status), timestamp: order.updatedAt, note });

    if (status === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "cod-collected";
    }
    return order;
  },

  async cancel(id, reason) {
    await sleep(300);
    const order = orderStore.find((o) => o.id === id);
    if (!order) throw new ServiceError(`Order ${id} not found`, "not-found");
    if (!isOrderCancellable(order.status)) {
      throw new ServiceError(`Order in status "${order.status}" cannot be cancelled`, "validation");
    }
    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
    order.timeline.push({ status: "cancelled", label: getOrderStatusLabel("cancelled"), timestamp: order.updatedAt, note: reason });
    return order;
  },

  async refund(id, reason) {
    await sleep(400);
    const order = orderStore.find((o) => o.id === id);
    if (!order) throw new ServiceError(`Order ${id} not found`, "not-found");
    if (order.paymentStatus !== "paid" && order.paymentStatus !== "cod-collected") {
      throw new ServiceError("Only paid or COD-collected orders can be refunded", "validation");
    }
    order.paymentStatus = "refunded";
    order.updatedAt = new Date().toISOString();
    order.timeline.push({ status: order.status, label: `Refund issued`, timestamp: order.updatedAt, note: reason });
    return order;
  },
};

export const orderService: OrderService = mockOrderService;

export { ORDER_STATUS_FLOW };
