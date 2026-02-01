import { NextResponse } from "next/server";
import { completeMission } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const missionId = body?.missionId as string | undefined;

    if (!missionId) {
      return NextResponse.json(
        { error: "Missing missionId" },
        { status: 400 }
      );
    }

    const result = completeMission(missionId);
    if (!result) {
      return NextResponse.json(
        { error: "Failed to complete mission" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        mission: result.mission,
        student: result.student,
        pendingReward: result.pendingReward,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error completing mission:", error);
    return NextResponse.json(
      { error: "Failed to complete mission" },
      { status: 500 }
    );
  }
}
