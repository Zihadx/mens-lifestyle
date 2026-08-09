"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400)); // simulated subscribe call
    trackEvent("Lead", { contentName: "newsletter_signup" });
    setIsSubmitting(false);
    setEmail("");
    toast.success("Subscribed — welcome to the list.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-10"
      />
      <Button type="submit" size="sm" className="shrink-0" loading={isSubmitting}>
        Subscribe
      </Button>
    </form>
  );
}
