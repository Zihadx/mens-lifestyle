"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { userService } from "@/features/admin/services/user.service";
import { formatDate } from "@/lib/utils";
import type { UserRole } from "@/store/slices/session-slice";

const ROLE_VARIANTS: Record<
  UserRole,
  "secondary" | "accent" | "success" | "muted"
> = {
  admin: "success",
  staff: "secondary",
  moderator: "accent",
  customer: "muted",
  user: "muted",
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
  } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => userService.list(),
  });

  const [inviteOpen, setInviteOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "staff" as UserRole,
  });

  const invite = useMutation({
    mutationFn: () => userService.invite(form),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });

      toast.success("Invitation sent");

      setInviteOpen(false);

      setForm({
        name: "",
        phone: "",
        email: "",
        role: "staff",
      });
    },
  });

  const toggleActive = useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }) => userService.setActive(id, isActive),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
    },
  });

  if (isLoading) {
    return (
      <div className="h-64 animate-pulse rounded-lg bg-secondary" />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Users
          </h1>

          <p className="text-sm text-muted-foreground">
            Staff accounts with admin access
          </p>
        </div>

        <Button onClick={() => setInviteOpen(true)}>
          <Plus className="size-4" />
          Invite User
        </Button>
      </div>

      {/* Users List */}
      <div className="space-y-2">
        {users.map((user) => {
          const initials = user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={user.id}
              className="
                flex items-center justify-between
                rounded-lg
                border border-border
                p-4
              "
            >
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-medium">
                    {user.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {user.email} · {user.phone}
                  </p>
                </div>
              </div>

              {/* User Controls */}
              <div className="flex items-center gap-4">
                <Badge
                  variant={ROLE_VARIANTS[user.role]}
                  className="capitalize"
                >
                  {user.role}
                </Badge>

                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Active {formatDate(user.lastActiveAt)}
                </span>

                <Switch
                  checked={user.isActive}
                  onCheckedChange={(value) =>
                    toggleActive.mutate({
                      id: user.id,
                      isActive: value,
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite User Dialog */}
      <Dialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite User
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label>Name</Label>

              <Input
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
              />
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Phone</Label>

                <Input
                  value={form.phone}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      phone: event.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>

                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label>Role</Label>

              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    role: value as UserRole,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="staff">
                    Staff
                  </SelectItem>

                  <SelectItem value="moderator">
                    Moderator
                  </SelectItem>

                  <SelectItem value="admin">
                    Admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              onClick={() => invite.mutate()}
              loading={invite.isPending}
              disabled={
                !form.name ||
                !form.phone ||
                invite.isPending
              }
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}