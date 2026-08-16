"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  loginSchema,
  otpRequestSchema,
  type LoginFormValues,
  type OtpRequestFormValues,
} from "@/schemas/auth.schema";

import {
  useLogin,
  useRequestOtp,
} from "@/features/auth/hooks/use-auth";

import { OtpVerifyStep } from "@/features/auth/components/otp-verify-step";
import { ServiceError } from "@/types/service";

export function LoginForm() {
  const router = useRouter();

  const login = useLogin();
  const requestOtp = useRequestOtp();

  const [otpPhone, setOtpPhone] = useState<string | null>(null);

  const passwordForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const otpForm = useForm<OtpRequestFormValues>({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: {
      phone: "",
    },
  });

  function onPasswordSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        toast.success("Welcome back");
        router.push("/account");
      },
      onError: (error) => {
        const message =
          error instanceof ServiceError
            ? error.message
            : "Couldn't sign you in.";

        passwordForm.setError("phone", {
          message,
        });
      },
    });
  }

  function onOtpRequest(values: OtpRequestFormValues) {
    requestOtp.mutate(values.phone, {
      onSuccess: () => setOtpPhone(values.phone),
      onError: () => {
        toast.error("Couldn't send a code. Try again.");
      },
    });
  }

  function handleGoogleLogin() {
    // UI only — Google OAuth will be connected later.
    toast.info("Google sign-in will be available soon.");
  }

  if (otpPhone) {
    return (
      <OtpVerifyStep
        phone={otpPhone}
        onBack={() => setOtpPhone(null)}
        onVerified={() => router.push("/account")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Social Login */}
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full gap-3 border-border bg-background font-medium transition-colors hover:bg-muted"
        onClick={handleGoogleLogin}
      >
        {/* Google Icon */}
        <svg
          viewBox="0 0 24 24"
          className="size-5 shrink-0"
          aria-hidden="true"
        >
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
            Or continue with
          </span>
        </div>
      </div>

      {/* Existing Login Methods */}
      <Tabs defaultValue="password">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="otp">Phone OTP</TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="01712345678"
                        inputMode="tel"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>

                      <Link
                        href="/forgot-password"
                        className="text-xs text-accent hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                loading={login.isPending}
              >
                Sign In
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Try a seeded phone number, e.g.{" "}
                <span className="font-medium text-foreground">
                  01711-223344
                </span>{" "}
                (any password)
              </p>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="otp">
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOtpRequest)}
              className="space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="01712345678"
                        inputMode="tel"
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
                Send Code
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}