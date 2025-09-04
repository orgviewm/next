import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    console.log("API received query:", query);

    if (!query || query.length < 1) {
      console.log("Empty query, returning empty array");
      return NextResponse.json({ symbols: [] });
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/NSE_EQ?select=SYMBOL_NAME,EXCHANGE_SEGMENT&SYMBOL_NAME=ilike.*${encodeURIComponent(query)}*&limit=10`;
    console.log("Supabase URL:", url);

    const response = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Supabase response status:", response.status);
    const symbols = await response.json();
    console.log("Supabase response data:", symbols);

    return NextResponse.json({ symbols });
  } catch (error) {
    console.error("Symbol search error:", error);
    return NextResponse.json({
      symbols: [],
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
