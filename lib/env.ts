const requiredEnv = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET"
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`Missing environment variable: ${key}`);
  }
}

export const env = {
  mongoUri: process.env.MONGODB_URI || "",
  accessSecret: process.env.JWT_ACCESS_SECRET || "development-access-secret",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "development-refresh-secret",
  accessExpiry: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshExpiry: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  cookieDomain: process.env.COOKIE_DOMAIN || "localhost",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000"
};
