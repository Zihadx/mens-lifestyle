import { siteConfig } from "@/config/site";
import { formatBDT } from "@/lib/utils";

export function AnnouncementBar() {
  return (
    <div className="bg-primary py-2 text-center text-xs font-medium text-primary-foreground">
      Free delivery on orders over {formatBDT(siteConfig.freeDeliveryThreshold)} · Cash on Delivery available nationwide
    </div>
  );
}
