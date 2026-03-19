import { jsonResponse } from "@/utils/api";

export async function GET() {
  return jsonResponse({ success: true, data: { socket: true }, message: "Socket server is handled by server.js" });
}
