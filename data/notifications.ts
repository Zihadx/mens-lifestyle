import type { AppNotification } from "@/types/misc";

function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60 * 1000).toISOString();
}

export const notifications: AppNotification[] = [
  { id: "ntf_0001", category: "orders", title: "New order placed", message: "Order VR100012 from Zahidul Islam — ৳1,750", isRead: false, createdAt: minutesAgo(4), href: "/admin/orders/ord_0012" },
  { id: "ntf_0002", category: "payments", title: "bKash payment received", message: "৳2,940 received for order VR100008", isRead: false, createdAt: minutesAgo(30), href: "/admin/payments" },
  { id: "ntf_0003", category: "inventory", title: "Low stock alert", message: "Essential Crewneck Tee (M, Navy) has only 3 units left", isRead: false, createdAt: minutesAgo(90), href: "/admin/inventory" },
  { id: "ntf_0004", category: "orders", title: "Order delivered", message: "Order VR100003 delivered successfully to Sylhet", isRead: true, createdAt: minutesAgo(200), href: "/admin/orders/ord_0004" },
  { id: "ntf_0005", category: "customers", title: "New customer registered", message: "Ovi Talukder created an account", isRead: true, createdAt: minutesAgo(320) },
  { id: "ntf_0006", category: "marketing", title: "Coupon usage milestone", message: "EID500 has been used 200+ times", isRead: true, createdAt: minutesAgo(600), href: "/admin/marketing" },
  { id: "ntf_0007", category: "system", title: "Weekly report ready", message: "Your sales report for last week is ready to view", isRead: true, createdAt: minutesAgo(1200), href: "/admin/analytics" },
  { id: "ntf_0008", category: "orders", title: "Failed delivery", message: "Order VR100002 could not be delivered — customer unreachable", isRead: false, createdAt: minutesAgo(60), href: "/admin/orders/ord_0003" },
];

export function getUnreadCount(): number {
  return notifications.filter((n) => !n.isRead).length;
}
