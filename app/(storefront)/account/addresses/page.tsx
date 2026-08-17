import { redirect } from "next/navigation";
import { MapPin, Plus, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { EmptyState } from "@/components/shared/empty-state";

import { customerService } from "@/features/customer/services/customer.service";

import { createClient } from "@/lib/supabase/server";

export default async function AddressesPage() {
  // ============================================
  // Supabase Auth
  // ============================================

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ============================================
  // Require Authentication
  // ============================================

  if (!user) {
    redirect("/login");
  }

  // ============================================
  // Get Current User
  // ============================================

  const customer =
    await customerService.getByUserId(user.id);

  const addresses = customer?.addresses ?? [];

  // ============================================
  // UI
  // ============================================

  return (
    <div className="space-y-4">
      {/* ========================================
          Header
      ======================================== */}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Saved Addresses
        </h2>

        <Button
          size="sm"
          variant="outline"
          type="button"
        >
          <Plus className="size-3.5" />
          Add Address
        </Button>
      </div>

      {/* ========================================
          Empty State
      ======================================== */}

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          description="Add an address to speed up checkout next time."
        />
      ) : (
        /* ======================================
           Address Cards
        ====================================== */

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="space-y-1.5 p-4">
                {/* Address Name / Default */}

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {address.name}
                  </p>

                  {address.isDefault && (
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <Star className="size-3 fill-accent" />
                      Default
                    </span>
                  )}
                </div>

                {/* Phone */}

                <p className="text-sm text-muted-foreground">
                  {address.phone}
                </p>

                {/* Address */}

                <p className="text-sm text-muted-foreground">
                  {address.address}
                </p>

                {/* City */}

                <p className="text-sm text-muted-foreground">
                  {address.city}
                </p>

                {/* Postal Code */}

                {address.postalCode && (
                  <p className="text-xs text-muted-foreground">
                    Postal Code: {address.postalCode}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}