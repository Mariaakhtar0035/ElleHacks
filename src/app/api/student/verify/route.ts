import { NextRequest, NextResponse } from "next/server";
import { verifyStudentPin } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const { studentId, pin } = await request.json();

    if (!studentId || typeof studentId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid studentId" },
        { status: 400 }
      );
    }
    if (!pin || typeof pin !== "string" || pin.length !== 4) {
      return NextResponse.json(
        { success: false, error: "PIN must be 4 digits" },
        { status: 400 }
      );
    }

    const valid = verifyStudentPin(studentId, pin);

    if (valid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
