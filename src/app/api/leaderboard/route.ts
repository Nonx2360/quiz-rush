import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const raw = await redis.zrange("leaderboard:score", 0, 9, {
      rev: true,
      withScores: true,
    });

    console.log("Raw leaderboard data:", raw);

    const result = [];
    for (let i = 0; i < raw.length; i += 2) {
      try {
        const member = raw[i];
        const score = raw[i + 1];
        const entry = typeof member === "string" ? JSON.parse(member) : member;
        result.push({ ...entry, score: Number(score) });
      } catch (e) {
        console.error("Parse error at index", i, e);
        continue;
      }
    }

    console.log("Parsed leaderboard:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Increment daily play count
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const bangkok = new Date(utc + 7 * 3600000);
    const year = bangkok.getFullYear();
    const month = String(bangkok.getMonth() + 1).padStart(2, "0");
    const day = String(bangkok.getDate()).padStart(2, "0");
    const todayKey = `plays:${year}-${month}-${day}`;
    await redis.incr(todayKey);

    const member = JSON.stringify({
      username: body.username,
      accuracy: body.accuracy,
      avgTime: body.avgTime,
      playedAt: Date.now(),
      contact: body.contact || null,
    });

    await redis.zadd("leaderboard:score", {
      score: body.score,
      member,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to submit score:", error);
    return NextResponse.json({ ok: false, error: "Failed to submit" }, { status: 500 });
  }
}
