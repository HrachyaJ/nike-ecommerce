import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

// This catch-all route will handle all auth-related requests
export async function GET(request: NextRequest) {
  console.log("Auth GET request:", request.url);
  try {
    // Pass all auth requests to the Better Auth handler
    const response = await auth.handler(request);
    console.log("Auth response status:", response.status);
    return response;
  } catch (error) {
    console.error("Error in auth route:", error);
    return new Response("Auth error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log("Auth POST request:", request.url);
  try {
    // Pass all auth requests to the Better Auth handler
    const response = await auth.handler(request);
    console.log("Auth response status:", response.status);
    return response;
  } catch (error) {
    console.error("Error in auth route:", error);
    return new Response("Auth error", { status: 500 });
  }
}
