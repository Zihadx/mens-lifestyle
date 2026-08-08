"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { otpVerifySchema, type OtpVerifyFormValues } from "@/schemas/auth.schema";
import { useVerifyOtp } from "@/features/auth/hooks/use-auth";

interface OtpVerifyStepProps {
  phone: string;
  onBack: () => void;
  onVerified: () => void;
}

export function OtpVerifyStep({ phone, onBack, onVerified }: OtpVerifyStepProps) {
  const verifyOtp = useVerifyOtp();
  const form = useForm<OtpVerifyFormValues>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { code: "" },
  });

  function onSubmit(values: OtpVerifyFormValues) {
    verifyOtp.mutate(
      { phone, code: values.code },
      {
        onSuccess: () => {
          toast.success("Verified");
          onVerified();
        },
        onError: () => form.setError("code", { message: "That code didn't work. Try again." }),
      }
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-3.5" /> Back
      </button>
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code sent to <span className="font-medium text-foreground">{phone}</span>.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="123456" inputMode="numeric" maxLength={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" loading={verifyOtp.isPending}>
            Verify &amp; Continue
          </Button>
          <p className="text-center text-xs text-muted-foreground">Any 6-digit code works in this preview.</p>
        </form>
      </Form>
    </div>
  );
}
