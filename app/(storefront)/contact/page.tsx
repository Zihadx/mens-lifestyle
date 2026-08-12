"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics/track";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(11, "Enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    await new Promise((r) => setTimeout(r, 500));
    trackEvent("Contact");
    toast.success("Message sent — we'll get back to you soon.");
    form.reset();
  }

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-2 font-display text-3xl font-medium tracking-tight">Contact Us</h1>
      <p className="mb-8 text-sm text-muted-foreground">Questions about an order, a product, or anything else — we're happy to help.</p>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <a href={`tel:${siteConfig.supportPhone}`} className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
          <Phone className="size-4 text-accent" /> {siteConfig.supportPhone}
        </a>
        <a href={`mailto:${siteConfig.supportEmail}`} className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
          <Mail className="size-4 text-accent" /> {siteConfig.supportEmail}
        </a>
        <div className="flex items-center gap-2 rounded-md border border-border p-3 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-accent" /> {siteConfig.address}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="01712345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" loading={form.formState.isSubmitting}>
            Send Message
          </Button>
        </form>
      </Form>
    </div>
  );
}
