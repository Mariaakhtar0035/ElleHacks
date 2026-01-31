import { NextRequest, NextResponse } from "next/server";
import { generateExplanation } from "@/lib/gemini";
import { ExplanationType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { type, studentName, context } = await request.json();

    if (!type || !studentName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const explanation = await generateExplanation(
      type as ExplanationType,
      studentName,
      context
    );

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error generating explanation:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
