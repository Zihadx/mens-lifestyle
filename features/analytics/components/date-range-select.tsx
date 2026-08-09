"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DateRange } from "@/features/analytics/services/analytics.service";

const OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

interface DateRangeSelectProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function DateRangeSelect({ value, onChange }: DateRangeSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRange)}>
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
