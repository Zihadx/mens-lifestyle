"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  otpVerifySchema,
  type OtpVerifyFormValues,
} from "@/schemas/auth.schema";

import { createClient } from "@/lib/supabase/client";

interface OtpVerifyStepProps {
  email?: string;
  phone?: string;
  onBack: () => void;
  onVerified: () => void;
}

export function OtpVerifyStep({
  email,
  phone,
  onBack,
  onVerified,
}: OtpVerifyStepProps) {
  const supabase = createClient();

  const form = useForm<OtpVerifyFormValues>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const isEmail = Boolean(email);
  const identifier = email ?? phone ?? "";

  const onSubmit = async (values: OtpVerifyFormValues) => {
    try {
      if (!identifier) {
        toast.error("Email or phone number is required.");
        return;
      }

      // ============================================
      // Email OTP
      // ============================================

      if (email) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: values.code,
          type: "email",
        });

        if (error) {
          console.error("Email OTP verification error:", error);

          form.setError("code", {
            message: error.message || "That verification code is invalid.",
          });

          return;
        }
      }

      // ============================================
      // Phone OTP
      // ============================================

      if (phone) {
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token: values.code,
          type: "sms",
        });

        if (error) {
          console.error("Phone OTP verification error:", error);

          form.setError("code", {
            message: error.message || "That verification code is invalid.",
          });

          return;
        }
      }

      toast.success(
        isEmail
          ? "Email verified successfully."
          : "Phone verified successfully.",
      );

      onVerified();
    } catch (error) {
      console.error("OTP verification error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Back */}

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" />
        Back
      </button>

      {/* Header */}

      <div className="space-y-1">
        <h3 className="text-sm font-medium">
          {isEmail ? "Verify your email" : "Verify your phone"}
        </h3>

        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">{identifier}</span>.
        </p>
      </div>

      {/* OTP Form */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>

                <FormControl>
                  <Input
                    placeholder="123456"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            loading={form.formState.isSubmitting}
          >
            Verify & Continue
          </Button>
        </form>
      </Form>

      <p className="text-center text-xs text-muted-foreground">
        Check your {isEmail ? "inbox" : "phone"} for the verification code.
      </p>
    </div>
  );
}
