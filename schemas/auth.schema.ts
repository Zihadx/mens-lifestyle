import { z } from "zod";

// ============================================
// Common Schemas
// ============================================

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(255, "Email is too long");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

// ============================================
// Login
// ============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ============================================
// Register
// ============================================

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(100, "Name is too long"),

  email: emailSchema,

  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

// ============================================
// Email OTP Request
// ============================================

export const otpRequestSchema = z.object({
  email: emailSchema,
});

export type OtpRequestFormValues = z.infer<
  typeof otpRequestSchema
>;

// ============================================
// OTP Verification
// ============================================

export const otpVerifySchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type OtpVerifyFormValues = z.infer<
  typeof otpVerifySchema
>;




// ============================================
// Reset Password
// ============================================

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters.",
      ),

    confirmPassword: z
      .string()
      .min(
        8,
        "Please confirm your password.",
      ),
  })
  .refine(
    (values) =>
      values.password === values.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export type ResetPasswordFormValues =
  z.infer<typeof resetPasswordSchema>;