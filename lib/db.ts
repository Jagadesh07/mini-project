import mongoose from "mongoose";
import { env } from "@/lib/env";
import { AppError } from "@/utils/errors";

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache || {
  conn: null,
  promise: null
};

global.mongooseCache = cached;

function maskMongoUri(uri: string) {
  return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/, "$1***$3");
}

function mapServerSelectionError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("ip that isn't whitelisted") ||
    normalized.includes("ip that isn\'t whitelisted") ||
    normalized.includes("whitelist") ||
    normalized.includes("network access")
  ) {
    return new AppError(
      "MongoDB Atlas blocked this machine. Add your current IP address in Atlas Network Access, then restart the dev server.",
      503
    );
  }

  if (normalized.includes("querysrv enotfound") || normalized.includes("dns")) {
    return new AppError(
      "MongoDB Atlas DNS lookup failed. Check the cluster hostname in MONGODB_URI and verify local DNS/network access.",
      503
    );
  }

  if (normalized.includes("replicasetnoprimary") || normalized.includes("no primary") || normalized.includes("topology is closed")) {
    return new AppError(
      `MongoDB Atlas was reached but no writable primary could be selected. Driver details: ${message}`,
      503
    );
  }

  if (normalized.includes("server selection timed out")) {
    return new AppError(
      `MongoDB server selection timed out. Atlas was reachable, but no suitable server was selected. Driver details: ${message}`,
      503
    );
  }

  return new AppError(`MongoDB server selection failed: ${message}`, 503);
}

function mapDatabaseError(error: any) {
  const message = String(error?.message || "");
  const normalized = message.toLowerCase();
  const code = error?.code;

  if (normalized.includes("bad auth") || normalized.includes("authentication failed")) {
    return new AppError(
      "Database authentication failed. Check the MongoDB Atlas username and password in .env.local.",
      503
    );
  }

  if (
    normalized.includes("not allowed to access") ||
    normalized.includes("whitelist") ||
    normalized.includes("network access")
  ) {
    return new AppError(
      "MongoDB Atlas blocked this machine. Add your current IP address in Atlas Network Access, then restart the dev server.",
      503
    );
  }

  if (code === "ECONNREFUSED") {
    return new AppError(
      "Database connection was refused. Verify the target MongoDB host is reachable from this machine.",
      503
    );
  }

  if (error?.name === "MongooseServerSelectionError") {
    return mapServerSelectionError(message);
  }

  return error;
}

export async function connectToDatabase() {
  console.log("Using Mongo URI:", maskMongoUri(env.mongoUri));

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(env.mongoUri, {
        serverSelectionTimeoutMS: 5000
      })
      .catch((error) => {
        cached.promise = null;
        throw mapDatabaseError(error);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
