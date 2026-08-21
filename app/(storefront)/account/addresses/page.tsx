import { MapPin, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { customerService } from "@/features/customer/services/customer.service";
import { DEMO_CUSTOMER_ID } from "@/features/account/constants";

export default async function AddressesPage() {
  const customer = await customerService.getById(DEMO_CUSTOMER_ID);
  const addresses = customer?.addresses ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Saved Addresses</h2>
        <Button size="sm" variant="outline">
          <Plus className="size-3.5" /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No saved addresses" description="Add an address to speed up checkout next time." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="space-y-1.5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{address.label}</p>
                  {address.isDefault && (
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <Star className="size-3 fill-accent" /> Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{address.fullName}</p>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {address.addressLine}, {address.area}, {address.district}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
