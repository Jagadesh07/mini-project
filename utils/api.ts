import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

export function jsonResponse<T>(payload: ApiResponse<T>, status = 200) {
  return NextResponse.json(payload, { status });
}
