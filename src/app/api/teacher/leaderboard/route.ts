import { NextRequest, NextResponse } from "next/server";
import { getMissions } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const missions = getMissions();
    
    // Return all missions with their current pricing data
    return NextResponse.json({ missions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}
