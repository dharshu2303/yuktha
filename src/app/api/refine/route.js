import { NextResponse } from "next/server";
import { refineContent } from "@/lib/gemini";

export async function POST(request) {
  try {
    const { currentContent, userMessage, language } = await request.json();

    if (!currentContent || !userMessage) {
      return NextResponse.json(
        { error: "Content and message are required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const result = await refineContent(
      currentContent,
      userMessage,
      language || "en"
    );

    return NextResponse.json({
      updatedPreviewContent: result.updatedPreviewContent,
      updatedPublishedContent: result.updatedPublishedContent,
      aiMessage: result.aiMessage,
    });
  } catch (error) {
    console.error("Refine API error:", error);

    const isRateLimited =
      error.status === 429 ||
      error.message?.includes("429") ||
      error.message?.includes("quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED");

    return NextResponse.json(
      {
        error: isRateLimited
          ? "Rate limit exceeded. Please wait a minute and try again."
          : error.message || "Refinement failed",
      },
      { status: isRateLimited ? 429 : 500 }
    );
  }
}
