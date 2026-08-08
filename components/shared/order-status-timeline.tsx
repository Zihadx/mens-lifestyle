import { CheckCircle2, CircleDot, XCircle } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { ORDER_STATUS_FLOW, getOrderStatusLabel, type OrderStatus } from "@/lib/business-logic";
import type { OrderTimelineEvent } from "@/types/order";

const TERMINAL_NEGATIVE: OrderStatus[] = ["cancelled", "failed-delivery", "returned"];

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  events: OrderTimelineEvent[];
}

export function OrderStatusTimeline({ currentStatus, events }: OrderStatusTimelineProps) {
  const isNegativeTerminal = TERMINAL_NEGATIVE.includes(currentStatus);

  // Happy-path steps always render in order, even if the order hasn't reached them yet.
  const steps = ORDER_STATUS_FLOW.map((status) => {
    const event = events.find((e) => e.status === status);
    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
    const stepIndex = ORDER_STATUS_FLOW.indexOf(status);
    const isComplete = !isNegativeTerminal && stepIndex <= currentIndex && currentIndex !== -1;
    const isCurrent = !isNegativeTerminal && status === currentStatus;
    return { status, event, isComplete, isCurrent };
  });

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
          {i < steps.length - 1 && (
            <div
              className={cn(
                "absolute left-[11px] top-6 h-full w-px",
                step.isComplete ? "bg-success" : "bg-border"
              )}
            />
          )}
          <div className="relative z-10 shrink-0">
            {step.isComplete && !step.isCurrent ? (
              <CheckCircle2 className="size-6 fill-success text-success-foreground" />
            ) : step.isCurrent ? (
              <CircleDot className="size-6 animate-pulse text-accent" />
            ) : (
              <div className="size-6 rounded-full border-2 border-border bg-background" />
            )}
          </div>
          <div className="pb-1">
            <p className={cn("text-sm font-medium", !step.isComplete && !step.isCurrent && "text-muted-foreground")}>
              {getOrderStatusLabel(step.status)}
            </p>
            {step.event ? (
              <p className="text-xs text-muted-foreground">{formatDate(step.event.timestamp, { hour: "2-digit", minute: "2-digit" })}</p>
            ) : null}
          </div>
        </div>
      ))}

      {isNegativeTerminal && (
        <div className="flex gap-4 border-t border-border pt-6">
          <XCircle className="size-6 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">{getOrderStatusLabel(currentStatus)}</p>
            {events.at(-1) ? (
              <>
                <p className="text-xs text-muted-foreground">{formatDate(events.at(-1)!.timestamp, { hour: "2-digit", minute: "2-digit" })}</p>
                {events.at(-1)!.note && <p className="mt-1 text-xs text-muted-foreground">{events.at(-1)!.note}</p>}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
