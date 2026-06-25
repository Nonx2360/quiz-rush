import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { GameConfig, DEFAULT_GAME_CONFIG } from "@/lib/config";

const redis = Redis.fromEnv();
const CONFIG_KEY = "game:config";

export async function GET() {
  try {
    const raw = await redis.get<string>(CONFIG_KEY);
    if (raw) {
      const config = typeof raw === "string" ? JSON.parse(raw) : raw;
      return NextResponse.json(config);
    }
    return NextResponse.json(DEFAULT_GAME_CONFIG);
  } catch (error) {
    console.error("Failed to fetch config:", error);
    return NextResponse.json(DEFAULT_GAME_CONFIG);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const config: GameConfig = {
      totalQuestions: Math.max(1, Math.min(50, body.totalQuestions || 15)),
      timePerQuestion: Math.max(5, Math.min(60, body.timePerQuestion || 15)),
      eventDropRate: Math.max(0, Math.min(1, body.eventDropRate || 0.3)),
      events: body.events || DEFAULT_GAME_CONFIG.events,
    };

    await redis.set(CONFIG_KEY, JSON.stringify(config));
    return NextResponse.json({ ok: true, config });
  } catch (error) {
    console.error("Failed to update config:", error);
    return NextResponse.json({ ok: false, error: "Failed to update" }, { status: 500 });
  }
}
