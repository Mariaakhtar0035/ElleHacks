import { NextResponse } from "next/server";
import {
  getMissions,
  getStudents,
  getRewards,
  getPendingApprovalMissions,
} from "@/lib/store";

export async function GET() {
  try {
    const missions = getMissions();
    const students = getStudents();
    const rewards = getRewards();
    const pendingMissions = getPendingApprovalMissions();

    return NextResponse.json(
      { missions, students, rewards, pendingMissions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching teacher dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
