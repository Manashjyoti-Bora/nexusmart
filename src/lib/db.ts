import mongoose from "mongoose";

/**
 * MongoDB connection with global caching — prevents opening a new
 * connection on every API call (critical for serverless/Vercel).
 * Falls back to DEMO MODE when MONGODB_URI is not set, so the app
 * runs out of the box with in-memory sample data.
 */

const MONGODB_URI = process.env.MONGODB_URI;

export const DEMO_MODE = !MONGODB_URI;

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalWithCache = global as typeof global & { _mongoose?: Cached };
const cached: Cached = globalWithCache._mongoose ?? { conn: null, promise: null };
globalWithCache._mongoose = cached;

export async function dbConnect() {
  if (DEMO_MODE) throw new Error("DEMO_MODE");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
