"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";

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

import { AuthShell } from "@/features/auth/components/auth-shell";
import { OtpVerifyStep } from "@/features/auth/components/otp-verify-step";

import {
  otpRequestSchema,
  type OtpRequestFormValues,
} from "@/schemas/auth.schema";

import { useRequestOtp } from "@/features/auth/hooks/use-auth";

export default function ForgotPasswordPage() {
  const requestOtp = useRequestOtp();

  const [otpEmail, setOtpEmail] = useState<string | null>(
    null,
  );

  const [isDone, setIsDone] = useState(false);

  const form = useForm<OtpRequestFormValues>({
    resolver: zodResolver(otpRequestSchema),

    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: OtpRequestFormValues) {
    const email = values.email.trim();

    requestOtp.mutate(email, {
      onSuccess: () => {
        setOtpEmail(email);
      },
    });
  }

  // ============================================
  // Reset Complete
  // ============================================

  if (isDone) {
    return (
      <AuthShell title="Password Reset">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 className="size-10 text-success" />

          <p className="text-sm text-muted-foreground">
            Your password has been reset. You can now sign in.
          </p>

          <Button asChild className="mt-2 w-full">
            <Link href="/login">
              Back to Sign In
            </Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  // ============================================
  // OTP Verification
  // ============================================

  if (otpEmail) {
    return (
      <AuthShell title="Verify It's You">
        <OtpVerifyStep
          email={otpEmail}
          onBack={() => setOtpEmail(null)}
          onVerified={() => setIsDone(true)}
        />
      </AuthShell>
    );
  }

  // ============================================
  // Email Request
  // ============================================

  return (
    <AuthShell
      title="Forgot Password"
      description="Enter your email address and we'll send you a verification code."
      footer={
        <Link
          href="/login"
          className="font-medium text-accent hover:underline"
        >
          Back to Sign In
        </Link>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address
                </FormLabel>

                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
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
            loading={requestOtp.isPending}
          >
            Send Verification Code
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}