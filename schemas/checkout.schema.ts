import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .min(11, "Enter a valid phone number")
    .regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number (e.g. 01712345678)"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  district: z.string().min(1, "Select a district"),
  area: z.string().min(2, "Enter your area/thana"),
  addressLine: z.string().min(5, "Enter your full address"),
  paymentMethod: z.enum(["cod", "bkash", "nagad", "rocket", "card"]),
  orderNotes: z.string().optional(),
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms to place an order" }) }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
