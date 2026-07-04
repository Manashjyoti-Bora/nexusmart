import { z } from "zod";

/** Shared client + server validation. Never trust the browser alone. */

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().min(1, "Price must be at least ₹1"),
  category: z.string().min(2).max(40),
  emoji: z.string().min(1).max(8).default("📦"),
  stock: z.coerce.number().min(0).default(100),
  featured: z.coerce.boolean().default(false),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number().min(0),
        qty: z.number().int().min(1).max(99),
        emoji: z.string(),
      }),
    )
    .min(1, "Cart is empty"),
});
