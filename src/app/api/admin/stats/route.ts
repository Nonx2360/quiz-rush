import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

function getTodayKey(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const bangkok = new Date(utc + 7 * 3600000);
  const year = bangkok.getFullYear();
  const month = String(bangkok.getMonth() + 1).padStart(2, "0");
  const day = String(bangkok.getDate()).padStart(2, "0");
  return `plays:${year}-${month}-${day}`;
}

export async function GET() {
  try {
    const todayKey = getTodayKey();
    const playCount = await redis.get<number>(todayKey);

    return NextResponse.json({ playCount: playCount || 0 });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ playCount: 0 });
  }
}
