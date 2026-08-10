"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useStoreSettings, useUpdateStoreSettings } from "@/features/settings/hooks/use-settings";
import type { StoreSettings } from "@/features/settings/services/settings.service";

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();
  const [form, setForm] = useState<StoreSettings | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  function set<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function save() {
    if (!form) return;
    updateSettings.mutate(form, { onSuccess: () => toast.success("Settings saved") });
  }

  if (isLoading || !form) return <div className="h-64 animate-pulse rounded-lg bg-secondary" />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Store configuration used across the storefront and checkout</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="social">Social &amp; Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 rounded-lg border border-border p-5">
          <div className="space-y-1.5">
            <Label>Store Name</Label>
            <Input value={form.storeName} onChange={(e) => set("storeName", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Support Phone</Label>
              <Input value={form.supportPhone} onChange={(e) => set("supportPhone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Support Email</Label>
              <Input value={form.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Warehouse / Business Address</Label>
            <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} rows={2} />
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4 rounded-lg border border-border p-5">
          <div className="space-y-1.5">
            <Label>Free Delivery Threshold (৳)</Label>
            <Input type="number" value={form.freeDeliveryThreshold} onChange={(e) => set("freeDeliveryThreshold", Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Inside Dhaka Charge (৳)</Label>
              <Input type="number" value={form.insideDhakaCharge} onChange={(e) => set("insideDhakaCharge", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Outside Dhaka Charge (৳)</Label>
              <Input type="number" value={form.outsideDhakaCharge} onChange={(e) => set("outsideDhakaCharge", Number(e.target.value))} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4 rounded-lg border border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <Label>Cash on Delivery</Label>
              <p className="text-xs text-muted-foreground">Allow customers to pay on delivery</p>
            </div>
            <Switch checked={form.codEnabled} onCheckedChange={(v) => set("codEnabled", v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Online Payment</Label>
              <p className="text-xs text-muted-foreground">bKash, Nagad, Rocket, and card payments</p>
            </div>
            <Switch checked={form.onlinePaymentEnabled} onCheckedChange={(v) => set("onlinePaymentEnabled", v)} />
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 rounded-lg border border-border p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Facebook URL</Label>
              <Input value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Instagram URL</Label>
              <Input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Meta Pixel ID</Label>
              <Input placeholder="Not connected" value={form.metaPixelId} onChange={(e) => set("metaPixelId", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Google Analytics ID</Label>
              <Input placeholder="Not connected" value={form.gaId} onChange={(e) => set("gaId", e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            These map to <code className="rounded bg-secondary px-1 py-0.5">NEXT_PUBLIC_META_PIXEL_ID</code> /{" "}
            <code className="rounded bg-secondary px-1 py-0.5">NEXT_PUBLIC_GA_ID</code> — set as real environment variables when you connect
            live tracking, not saved here in the frontend preview.
          </p>
        </TabsContent>
      </Tabs>

      <Button onClick={save} loading={updateSettings.isPending}>
        Save Settings
      </Button>
    </div>
  );
}
