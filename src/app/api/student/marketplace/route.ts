import { NextResponse } from "next/server";
import { getAvailableMissions, requestMission } from "@/lib/store";

export async function GET() {
  try {
    const missions = getAvailableMissions();
    return NextResponse.json({ missions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching marketplace missions:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketplace missions" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studentId = body?.studentId as string | undefined;
    const missionId = body?.missionId as string | undefined;

    if (!studentId || !missionId) {
      return NextResponse.json(
        { error: "Missing studentId or missionId" },
        { status: 400 },
      );
    }

    const mission = requestMission(studentId, missionId);

    if (!mission) {
      return NextResponse.json(
        { error: "Mission request failed" },
        { status: 400 },
      );
    }

    const missions = getAvailableMissions();
    return NextResponse.json({ mission, missions }, { status: 200 });
  } catch (error) {
    console.error("Error requesting mission:", error);
    return NextResponse.json(
      { error: "Failed to request mission" },
      { status: 500 },
    );
  }
}
