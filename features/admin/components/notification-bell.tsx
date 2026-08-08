"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { notificationService } from "@/features/notification/services/notification.service";
import { queryKeys } from "@/lib/query-keys";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CATEGORY_DOT: Record<string, string> = {
  orders: "bg-accent",
  payments: "bg-success",
  inventory: "bg-warning",
  customers: "bg-primary",
  marketing: "bg-brass-500",
  system: "bg-muted-foreground",
};

export function NotificationBell() {
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useQuery({
    queryKey: queryKeys.notifications.all(),
    queryFn: () => notificationService.list(),
  });
  const { data: unreadCount = 0 } = useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: () => notificationService.getUnreadCount(),
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full bg-destructive" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="size-3" /> Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications" className="py-8" />
          ) : (
            notifications.slice(0, 8).map((n) => (
              <div key={n.id} className={cn("flex gap-2.5 border-b border-border p-3 last:border-0", !n.isRead && "bg-secondary/40")}>
                <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", CATEGORY_DOT[n.category])} />
                <div className="flex-1">
                  <p className="text-xs font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{formatDate(n.createdAt, { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
