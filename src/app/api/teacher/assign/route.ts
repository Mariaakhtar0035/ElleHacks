import { NextResponse } from "next/server";
import { assignMission, unassignMission, getMission } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const missionId = body?.missionId as string | undefined;
    const studentId = body?.studentId as string | undefined;

    if (!missionId || !studentId) {
      return NextResponse.json(
        { error: "Missing missionId or studentId" },
        { status: 400 }
      );
    }

    const mission = getMission(missionId);
    if (mission?.assignedStudentId && mission.assignedStudentId !== studentId) {
      unassignMission(missionId);
    }

    const result = assignMission(missionId, studentId);
    if (!result) {
      return NextResponse.json(
        { error: "Failed to assign mission" },
        { status: 400 }
      );
    }

    return NextResponse.json({ mission: result }, { status: 200 });
  } catch (error) {
    console.error("Error assigning mission:", error);
    return NextResponse.json(
      { error: "Failed to assign mission" },
      { status: 500 }
    );
  }
}
