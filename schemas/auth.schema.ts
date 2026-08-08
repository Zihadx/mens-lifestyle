import { z } from "zod";

const phoneSchema = z
  .string()
  .min(11, "Enter a valid phone number")
  .regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number (e.g. 01712345678)");

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: phoneSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const otpRequestSchema = z.object({
  phone: phoneSchema,
});
export type OtpRequestFormValues = z.infer<typeof otpRequestSchema>;

export const otpVerifySchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});
export type OtpVerifyFormValues = z.infer<typeof otpVerifySchema>;
