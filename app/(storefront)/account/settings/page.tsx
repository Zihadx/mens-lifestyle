"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(11, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountSettingsPage() {
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "Tanvir Ahmed", phone: "01711-223344", email: "tanvir.ahmed@gmail.com" },
  });

  async function onSubmit() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsSaving(false);
    toast.success("Profile updated");
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Profile Information</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" loading={isSaving}>
              Save Changes
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notify-orders">Order updates</Label>
              <p className="text-xs text-muted-foreground">SMS and email when your order status changes</p>
            </div>
            <Switch id="notify-orders" checked={notifyOrders} onCheckedChange={setNotifyOrders} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notify-marketing">Offers & new arrivals</Label>
              <p className="text-xs text-muted-foreground">Occasional emails about sales and new collections</p>
            </div>
            <Switch id="notify-marketing" checked={notifyMarketing} onCheckedChange={setNotifyMarketing} />
          </div>
        </div>
      </div>
    </div>
  );
}
