import { NextRequest, NextResponse } from "next/server";
import { askNarrator } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentName, question } = body;

    if (!studentName || typeof studentName !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid studentName" },
        { status: 400 }
      );
    }
    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid question" },
        { status: 400 }
      );
    }

    const answer = await askNarrator(studentName.trim(), question);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error in ask narrator:", error);
    return NextResponse.json(
      { error: "Failed to get answer" },
      { status: 500 }
    );
  }
}
