"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "sonner";

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
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

import {
  otpRequestSchema,
  type OtpRequestFormValues,
} from "@/schemas/auth.schema";

import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  // ============================================
  // State
  // ============================================

  const [otpEmail, setOtpEmail] =
    useState<string | null>(null);

  const [otpVerified, setOtpVerified] =
    useState(false);

  const [isDone, setIsDone] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const [captchaToken, setCaptchaToken] =
    useState<string | null>(null);

  // ============================================
  // Form
  // ============================================

  const form = useForm<OtpRequestFormValues>({
    resolver: zodResolver(otpRequestSchema),

    defaultValues: {
      email: "",
    },
  });

  // ============================================
  // Send Password Reset OTP
  // ============================================

  const onSubmit = async (
    values: OtpRequestFormValues,
  ) => {
    if (!captchaToken) {
      toast.error(
        "Please complete the security verification.",
      );

      return;
    }

    setIsSending(true);

    try {
      const email = values.email
        .trim()
        .toLowerCase();

      const { error } =
        await supabase.auth.signInWithOtp({
          email,

          options: {
            shouldCreateUser: false,
            captchaToken,
          },
        });

      if (error) {
        console.error(
          "Password reset OTP error:",
          error,
        );

        toast.error(
          error.message ||
            "Couldn't send verification code.",
        );

        return;
      }

      console.log(
        "Password reset OTP sent successfully.",
      );

      setOtpEmail(email);

      // Turnstile token is single-use.
      setCaptchaToken(null);

      toast.success(
        "Verification code sent to your email.",
      );
    } catch (error) {
      console.error(
        "Password reset OTP request failed:",
        error,
      );

      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  // ============================================
  // Password Reset Complete
  // ============================================

  if (isDone) {
    return (
      <AuthShell title="Password Reset">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 className="size-10 text-success" />

          <p className="text-sm text-muted-foreground">
            Your password has been reset successfully.
          </p>

          <Button
            asChild
            className="mt-2 w-full"
          >
            <Link href="/login">
              Back to Sign In
            </Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  // ============================================
  // Create New Password
  // ============================================

  if (otpEmail && otpVerified) {
    return (
      <AuthShell
        title="Create New Password"
        description="Choose a strong new password for your account."
      >
        <ResetPasswordForm
          email={otpEmail}
          onSuccess={() => setIsDone(true)}
        />
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
          onBack={() => {
            setOtpEmail(null);
            setOtpVerified(false);
          }}
          onVerified={() => {
            setOtpVerified(true);
          }}
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
          {/* ======================================
              Email
          ====================================== */}

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

          {/* ======================================
              Cloudflare Turnstile
          ====================================== */}

          <div className="flex justify-center">
            <Turnstile
              siteKey={
                process.env
                  .NEXT_PUBLIC_TURNSTILE_SITE_KEY!
              }
              onSuccess={(token) => {
                console.log(
                  "Turnstile verification successful.",
                );

                setCaptchaToken(token);
              }}
              onError={(error) => {
                console.error(
                  "Turnstile error:",
                  error,
                );

                setCaptchaToken(null);

                toast.error(
                  "Security verification failed. Please try again.",
                );
              }}
              onExpire={() => {
                console.warn(
                  "Turnstile token expired.",
                );

                setCaptchaToken(null);
              }}
            />
          </div>

          {/* ======================================
              Submit
          ====================================== */}

          <Button
            type="submit"
            className="w-full"
            loading={isSending}
            disabled={
              isSending || !captchaToken
            }
          >
            Send Verification Code
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}