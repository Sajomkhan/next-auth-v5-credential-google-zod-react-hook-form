import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(4, "Password must be more than 4 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is requrired" })
    .min(3, "Name must be more than 3 character")
    .max(32, "Name must be less than 32 character"),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Passowrd" })
    .min(1, "Password is required")
    .min(4, "Password must be more than 4 characters")
    .max(32, "Password must be less than 32 characters"),
});
