"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createClient } from "@/lib/supabase/client";

// ============================================
// Validation
// ============================================

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(100, "Name is too long"),

  phone: z
    .string()
    .trim()
    .min(11, "Enter a valid phone number")
    .max(20, "Phone number is too long"),

  email: z
    .string()
    .email("Invalid email address"),
});

type ProfileFormValues = z.infer<
  typeof profileSchema
>;

// ============================================
// Page
// ============================================

export default function AccountSettingsPage() {
  const router = useRouter();

  const supabase = createClient();

  const [notifyOrders, setNotifyOrders] =
    useState(true);

  const [notifyMarketing, setNotifyMarketing] =
    useState(false);

  const [isLoadingProfile, setIsLoadingProfile] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  // ============================================
  // Form
  // ============================================

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  // ============================================
  // Load Current User
  // ============================================

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setIsLoadingProfile(true);

      try {
        // ----------------------------------------
        // Get authenticated Supabase user
        // ----------------------------------------

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error(
            "Get user error:",
            userError,
          );

          toast.error(
            "Couldn't load your account.",
          );

          router.replace("/login");

          return;
        }

        if (!user) {
          router.replace("/login");

          return;
        }

        // ----------------------------------------
        // Get profile
        // ----------------------------------------

        const { data: profile, error } =
          await supabase
            .from("user_profiles")
            .select(
              "id, name, email, phone",
            )
            .eq("id", user.id)
            .maybeSingle();

        if (error) {
          console.error(
            "Get profile error:",
            error,
          );

          toast.error(
            "Couldn't load your profile.",
          );

          return;
        }

        if (!mounted) return;

        // ----------------------------------------
        // Use profile data
        // ----------------------------------------

        form.reset({
          name:
            profile?.name ??
            user.user_metadata?.name ??
            user.user_metadata?.full_name ??
            "",

          phone:
            profile?.phone ??
            user.phone ??
            "",

          email:
            profile?.email ??
            user.email ??
            "",
        });
      } catch (error) {
        console.error(
          "Profile loading failed:",
          error,
        );

        if (mounted) {
          toast.error(
            "Something went wrong while loading your profile.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [router, supabase, form]);

  // ============================================
  // Save Profile
  // ============================================

  async function onSubmit(
    values: ProfileFormValues,
  ) {
    setIsSaving(true);

    try {
      // ----------------------------------------
      // Get authenticated user
      // ----------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error(
          "Your session has expired. Please sign in again.",
        );

        router.replace("/login");

        return;
      }

      // ----------------------------------------
      // Update user_profiles
      // ----------------------------------------

      const { error: profileError } =
        await supabase
          .from("user_profiles")
          .update({
            name: values.name.trim(),
            phone: values.phone.trim(),
          })
          .eq("id", user.id);

      if (profileError) {
        console.error(
          "Profile update error:",
          profileError,
        );

        toast.error(
          profileError.message ||
            "Couldn't update your profile.",
        );

        return;
      }

      // ----------------------------------------
      // Keep Supabase Auth metadata in sync
      // ----------------------------------------

      const { error: authError } =
        await supabase.auth.updateUser({
          data: {
            name: values.name.trim(),
            full_name: values.name.trim(),
          },
        });

      if (authError) {
        console.error(
          "Auth metadata update error:",
          authError,
        );

        // Profile update already succeeded.
        // Don't show the entire operation as failed.
        toast.warning(
          "Profile saved, but some account information could not be synced.",
        );

        return;
      }

      // ----------------------------------------
      // Update local form state
      // ----------------------------------------

      form.reset({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email,
      });

      toast.success(
        "Profile updated successfully.",
      );
    } catch (error) {
      console.error(
        "Profile update failed:",
        error,
      );

      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  // ============================================
  // Loading
  // ============================================

  if (isLoadingProfile) {
    return (
      <div className="max-w-lg space-y-8">
        <div>
          <div className="mb-4 h-4 w-40 animate-pulse rounded bg-muted" />

          <div className="space-y-4">
            <div className="h-10 animate-pulse rounded-md bg-muted" />
            <div className="h-10 animate-pulse rounded-md bg-muted" />
            <div className="h-10 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-12 animate-pulse rounded bg-muted" />
          <div className="h-12 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="max-w-lg space-y-8">
      {/* ========================================
          Profile Information
      ======================================== */}

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Profile Information
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit,
            )}
            className="space-y-4"
          >
            {/* Name */}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="name"
                      placeholder="Your full name"
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
                  <FormLabel>
                    Phone Number
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      autoComplete="tel"
                      placeholder="01XXXXXXXXX"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email - NOT EDITABLE */}

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
                      {...field}
                      type="email"
                      disabled
                      readOnly
                      className="bg-muted/50"
                    />
                  </FormControl>

                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                    here.
                  </p>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Save */}

            <Button
              type="submit"
              loading={isSaving}
              disabled={isSaving}
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* ========================================
          Notifications
      ======================================== */}

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Notifications
        </h2>

        <div className="space-y-4">
          {/* Order Updates */}

          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="notify-orders">
                Order updates
              </Label>

              <p className="text-xs text-muted-foreground">
                SMS and email when your order
                status changes
              </p>
            </div>

            <Switch
              id="notify-orders"
              checked={notifyOrders}
              onCheckedChange={
                setNotifyOrders
              }
            />
          </div>

          {/* Marketing */}

          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="notify-marketing">
                Offers & new arrivals
              </Label>

              <p className="text-xs text-muted-foreground">
                Occasional emails about sales and
                new collections
              </p>
            </div>

            <Switch
              id="notify-marketing"
              checked={notifyMarketing}
              onCheckedChange={
                setNotifyMarketing
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}