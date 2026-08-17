"use client";

import { useState } from "react";
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
  email: string;
  onBack: () => void;
  onVerified: () => void;
}

export function OtpVerifyStep({
  email,
  onBack,
  onVerified,
}: OtpVerifyStepProps) {
  const supabase = createClient();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<OtpVerifyFormValues>({
    resolver: zodResolver(otpVerifySchema),

    defaultValues: {
      code: "",
    },
  });

  // ============================================
  // Verify OTP
  // ============================================

  const onSubmit = async (values: OtpVerifyFormValues) => {
    setIsVerifying(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: values.code,
        type: "email",
      });

      if (error) {
        console.error("OTP verification error:", error);

        form.setError("code", {
          message:
            error.message || "That verification code is invalid.",
        });

        return;
      }

      if (!data.session) {
        console.error("OTP verified but no session returned.");

        toast.error(
          "Email verified, but we couldn't create your session.",
        );

        return;
      }

      toast.success("Email verified successfully.");

      onVerified();
    } catch (error) {
      console.error("OTP verification failed:", error);

      toast.error(
        "Something went wrong while verifying your email.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // ============================================
  // Resend OTP
  // ============================================

  const handleResend = async () => {
    if (isResending) return;

    setIsResending(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,

        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        console.error("Resend OTP error:", error);

        toast.error(
          error.message || "Couldn't resend verification code.",
        );

        return;
      }

      toast.success("A new verification code has been sent.");
    } catch (error) {
      console.error("Resend OTP failed:", error);

      toast.error("Couldn't resend the code. Please try again.");
    } finally {
      setIsResending(false);
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
          Verify your email
        </h3>

        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">
            {email}
          </span>
          .
        </p>
      </div>

      {/* OTP Form */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
            loading={isVerifying}
          >
            Verify & Continue
          </Button>
        </form>
      </Form>

      {/* Resend */}

      <div className="space-y-2 text-center">
        <p className="text-xs text-muted-foreground">
          Didn't receive the code?
        </p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResend}
          loading={isResending}
        >
          Resend code
        </Button>
      </div>
    </div>
  );
}