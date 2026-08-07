import { notifications } from "@/data/notifications";
import type { AppNotification, NotificationCategory } from "@/types/misc";
import { sleep } from "@/lib/utils";

export interface NotificationService {
  list(category?: NotificationCategory): Promise<AppNotification[]>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
}

const notificationStore: AppNotification[] = [...notifications];

export const mockNotificationService: NotificationService = {
  async list(category) {
    await sleep(250);
    const sorted = [...notificationStore].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return category ? sorted.filter((n) => n.category === category) : sorted;
  },

  async getUnreadCount() {
    await sleep(100);
    return notificationStore.filter((n) => !n.isRead).length;
  },

  async markAsRead(id) {
    await sleep(150);
    const n = notificationStore.find((n) => n.id === id);
    if (n) n.isRead = true;
  },

  async markAllAsRead() {
    await sleep(200);
    notificationStore.forEach((n) => (n.isRead = true));
  },
};

export const notificationService: NotificationService = mockNotificationService;
