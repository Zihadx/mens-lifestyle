import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(
    /^01[3-9]\d{8}$/,
    "Enter a valid Bangladeshi phone number (e.g. 01712345678)",
  );

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be 72 characters or fewer");

export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(100, "Name is too long"),

  phone: phoneSchema,

  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const otpRequestSchema = z.object({
  phone: phoneSchema,
});

export type OtpRequestFormValues = z.infer<typeof otpRequestSchema>;

export const otpVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type OtpVerifyFormValues = z.infer<typeof otpVerifySchema>;
