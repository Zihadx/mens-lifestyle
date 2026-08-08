import { ExternalLink, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourierInfoCardProps {
  provider?: string;
  trackingId?: string;
  trackingUrl?: string;
}

export function CourierInfoCard({ provider, trackingId, trackingUrl }: CourierInfoCardProps) {
  if (!provider || !trackingId) {
    return (
      <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
        A courier will be assigned once your order is packed.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-border p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-secondary">
          <Truck className="size-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium">{provider}</p>
          <p className="text-xs text-muted-foreground">Tracking ID: {trackingId}</p>
        </div>
      </div>
      {trackingUrl && (
        <Button variant="outline" size="sm" asChild>
          <a href={trackingUrl} target="_blank" rel="noreferrer">
            Track <ExternalLink className="size-3" />
          </a>
        </Button>
      )}
    </div>
  );
}
