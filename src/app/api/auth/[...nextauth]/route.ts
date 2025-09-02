export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { handlers } from "@/auth";

const { GET: AuthGET, POST: AuthPOST } = handlers;

export async function GET(request: Request) {
  try {
    return await AuthGET(request);
  } catch (error) {
    console.error('Auth GET error:', error);
    return new Response('Authentication error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    return await AuthPOST(request);
  } catch (error) {
    console.error('Auth POST error:', error);
    return new Response('Authentication error', { status: 500 });
  }
}
