import { NextResponse } from "next/server";
import { aggregateNews } from "@/lib/news";

export const revalidate = 300;

export async function GET() {
  const data = await aggregateNews();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
