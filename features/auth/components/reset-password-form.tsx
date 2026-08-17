"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/schemas/auth.schema";

import { createClient } from "@/lib/supabase/client";

interface ResetPasswordFormProps {
  email: string;
  onSuccess: () => void;
}

export function ResetPasswordForm({
  email,
  onSuccess,
}: ResetPasswordFormProps) {
  const supabase = createClient();

  const [isUpdating, setIsUpdating] =
    useState(false);

  // ============================================
  // Form
  // ============================================

  const form =
    useForm<ResetPasswordFormValues>({
      resolver: zodResolver(
        resetPasswordSchema,
      ),

      defaultValues: {
        password: "",
        confirmPassword: "",
      },
    });

  // ============================================
  // Update Password
  // ============================================

  const onSubmit = async (
    values: ResetPasswordFormValues,
  ) => {
    setIsUpdating(true);

    try {
      // ==========================================
      // Make sure verified session still exists
      // ==========================================

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error(
          "Your verification session has expired. Please request a new code.",
        );

        return;
      }

      // ==========================================
      // Update Password
      // ==========================================

      const { error } =
        await supabase.auth.updateUser({
          password: values.password,
        });

      if (error) {
        console.error(
          "Password update error:",
          error,
        );

        toast.error(
          error.message ||
            "Couldn't update your password.",
        );

        return;
      }

      // ==========================================
      // Sign Out
      // ==========================================

      await supabase.auth.signOut();

      // ==========================================
      // Success
      // ==========================================

      toast.success(
        "Your password has been updated successfully.",
      );

      form.reset();

      onSuccess();
    } catch (error) {
      console.error(
        "Password update failed:",
        error,
      );

      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="space-y-5">
      {/* Account */}

      <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Resetting password for
        </p>

        <p className="truncate text-sm font-medium text-foreground">
          {email}
        </p>
      </div>

      {/* Form */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* New Password */}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  New Password
                </FormLabel>

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

          {/* Confirm Password */}

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm New Password
                </FormLabel>

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

          {/* Submit */}

          <Button
            type="submit"
            className="w-full"
            loading={isUpdating}
          >
            Update Password
          </Button>
        </form>
      </Form>
    </div>
  );
}