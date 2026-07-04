import mongoose, { Schema, model, models, type Model } from "mongoose";

/** ── User ─────────────────────────────────────────────────────── */
export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

/** ── Product ──────────────────────────────────────────────────── */
export interface IProduct {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  description: string;
  price: number; // in rupees
  category: string;
  emoji: string; // visual placeholder instead of external images (never breaks!)
  stock: number;
  featured: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    emoji: { type: String, default: "📦" },
    stock: { type: Number, default: 100, min: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

/** ── Order ────────────────────────────────────────────────────── */
export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}
export interface IOrder {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: "placed" | "shipped" | "delivered";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        qty: Number,
        emoji: String,
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["placed", "shipped", "delivered"], default: "placed" },
  },
  { timestamps: true },
);

export const User: Model<IUser> = models.User ?? model<IUser>("User", UserSchema);
export const Product: Model<IProduct> = models.Product ?? model<IProduct>("Product", ProductSchema);
export const Order: Model<IOrder> = models.Order ?? model<IOrder>("Order", OrderSchema);
