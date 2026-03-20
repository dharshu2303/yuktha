import { NextResponse } from "next/server";
import { generateFromCard } from "@/lib/gemini";

export async function POST(request) {
  try {
    const { cardImageBase64, voiceText, language } = await request.json();

    if (!cardImageBase64) {
      return NextResponse.json(
        { error: "Card image is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const result = await generateFromCard(
      cardImageBase64,
      voiceText || "",
      language || "en"
    );

    return NextResponse.json({
      previewContent: result.previewContent,
      publishedContent: result.publishedContent,
      template: result.template,
      metaTags: result.metaTags,
      extractedData: result.extractedData,
    });
  } catch (error) {
    console.error("Generate API error:", error);

    // Return proper status code for rate limiting
    const isRateLimited =
      error.status === 429 ||
      error.message?.includes("429") ||
      error.message?.includes("quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED");

    return NextResponse.json(
      {
        error: isRateLimited
          ? "Rate limit exceeded. Please wait a minute and try again."
          : error.message || "Generation failed",
      },
      { status: isRateLimited ? 429 : 500 }
    );
  }
}
