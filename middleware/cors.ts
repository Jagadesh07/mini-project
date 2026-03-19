import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", env.corsOrigin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  return response;
}
