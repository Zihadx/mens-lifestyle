"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { loginSchema, otpRequestSchema, type LoginFormValues, type OtpRequestFormValues } from "@/schemas/auth.schema";
import { useLogin, useRequestOtp } from "@/features/auth/hooks/use-auth";
import { OtpVerifyStep } from "@/features/auth/components/otp-verify-step";
import { ServiceError } from "@/types/service";

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const requestOtp = useRequestOtp();
  const [otpPhone, setOtpPhone] = useState<string | null>(null);

  const passwordForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
  });

  const otpForm = useForm<OtpRequestFormValues>({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: { phone: "" },
  });

  function onPasswordSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        toast.success("Welcome back");
        router.push("/account");
      },
      onError: (error) => {
        const message = error instanceof ServiceError ? error.message : "Couldn't sign you in.";
        passwordForm.setError("phone", { message });
      },
    });
  }

  function onOtpRequest(values: OtpRequestFormValues) {
    requestOtp.mutate(values.phone, {
      onSuccess: () => setOtpPhone(values.phone),
      onError: () => toast.error("Couldn't send a code. Try again."),
    });
  }

  if (otpPhone) {
    return <OtpVerifyStep phone={otpPhone} onBack={() => setOtpPhone(null)} onVerified={() => router.push("/account")} />;
  }

  return (
    <Tabs defaultValue="password">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="otp">Phone OTP</TabsTrigger>
      </TabsList>

      <TabsContent value="password">
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="01712345678" inputMode="tel" {...field} />
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
                    <Link href="/forgot-password" className="text-xs text-accent hover:underline">
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
            <Button type="submit" className="w-full" loading={login.isPending}>
              Sign In
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Try a seeded phone number, e.g. <span className="font-medium text-foreground">01711-223344</span> (any password)
            </p>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="otp">
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpRequest)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="01712345678" inputMode="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" loading={requestOtp.isPending}>
              Send Code
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
