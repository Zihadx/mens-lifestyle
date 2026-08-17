"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";

import { useRegister } from "@/features/auth/hooks/use-auth";
import { trackEvent } from "@/lib/analytics/track";
import { createClient } from "@/lib/supabase/client";
import { OtpVerifyStep } from "./otp-verify-step";


export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();
  const supabase = createClient();

  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  // ============================================
  // Google OAuth
  // ============================================

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);

        toast.error(
          error.message || "Couldn't continue with Google. Try again.",
        );
      }
    } catch (error) {
      console.error("Google OAuth error:", error);

      toast.error("Something went wrong. Try again.");
    }
  };

  // ============================================
  // Create Account + Send Email OTP
  // ============================================

  const onSubmit = async (values: RegisterFormValues) => {
    setIsOtpLoading(true);

    try {
      const email = values.email.trim();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error("Supabase OTP error:", error);

        toast.error(error.message);

        return;
      }

      setOtpEmail(email);

      toast.success("Verification code sent to your email.");
    } catch (error) {
      console.error("OTP request failed:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  // ============================================
  // OTP Verification Screen
  // ============================================

  if (otpEmail) {
    return (
      <OtpVerifyStep
        email={otpEmail}
        onBack={() => setOtpEmail(null)}
        onVerified={() => {
          sessionStorage.removeItem("pending-registration");

          trackEvent("CompleteRegistration");

          toast.success("Account created successfully.");

          router.push("/account");
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ========================================
          Google Signup
      ======================================== */}

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full gap-3 border-border bg-background font-medium transition-colors hover:bg-muted"
        onClick={handleGoogleSignup}
      >
        <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"
          />

          <path
            fill="#34A853"
            d="M12 21.72c2.63 0 4.84-.87 6.45-2.37l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.72Z"
          />

          <path
            fill="#FBBC05"
            d="M6.54 13.8a5.86 5.86 0 0 1 0-3.6V7.67H3.3a9.74 9.74 0 0 0 0 8.66l3.24-2.53Z"
          />

          <path
            fill="#EA4335"
            d="M12 6.17c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.22 14.63 2.28 12 2.28a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.89 9.46 6.17 12 6.17Z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Divider */}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">
            Or create an account with email
          </span>
        </div>
      </div>

      {/* Registration Form */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Your full name"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>

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

          {/* Phone */}

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>

                <FormControl>
                  <Input
                    placeholder="01712345678"
                    inputMode="tel"
                    autoComplete="tel"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Create Account */}

          <Button type="submit" className="w-full" loading={isOtpLoading}>
            Create Account
          </Button>
        </form>
      </Form>

      <p className="text-center text-xs text-muted-foreground">
        We'll send a 6-digit verification code to your email.
      </p>
    </div>
  );
}
