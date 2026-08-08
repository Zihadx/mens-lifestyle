"use client";

import { Wallet, Smartphone, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types/cart";

const METHODS: { value: PaymentMethod; label: string; description: string; icon: typeof Wallet }[] = [
  { value: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", icon: Wallet },
  { value: "bkash", label: "bKash", description: "Pay now via bKash", icon: Smartphone },
  { value: "nagad", label: "Nagad", description: "Pay now via Nagad", icon: Smartphone },
  { value: "rocket", label: "Rocket", description: "Pay now via Rocket", icon: Smartphone },
  { value: "card", label: "Card", description: "Visa, Mastercard, or local cards", icon: CreditCard },
];

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {METHODS.map(({ value: methodValue, label, description, icon: Icon }) => (
        <button
          key={methodValue}
          type="button"
          onClick={() => onChange(methodValue)}
          className={cn(
            "flex items-center gap-3 rounded-md border p-3 text-left transition-colors",
            value === methodValue ? "border-primary bg-secondary/60" : "border-input hover:border-foreground/40"
          )}
        >
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              value === methodValue ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            )}
          >
            <Icon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
