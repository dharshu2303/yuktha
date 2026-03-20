import { NextResponse } from "next/server";
import { saveSite, generateSlug } from "@/lib/storage";

export async function POST(request) {
  try {
    const { htmlContent, metaTags } = await request.json();

    if (!htmlContent) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    const slug = generateSlug();
    
    // Save to Supabase (keeps a record)
    await saveSite(slug, htmlContent, metaTags || {});

    // Deploy to Vercel dynamically
    if (!process.env.VERCEL_TOKEN) {
      console.warn("VERCEL_TOKEN not set, fallback to local URL");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      return NextResponse.json({ url: `${baseUrl}/sites/${slug}`, slug: slug });
    }

    const vercelResponse = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: `yuktha-site-${slug}`,
        files: [
          {
            file: "index.html",
            data: htmlContent
          }
        ],
        projectSettings: {
          framework: null
        }
      })
    });

    if (!vercelResponse.ok) {
      const errorData = await vercelResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "Vercel API deployment failed");
    }

    const vercelData = await vercelResponse.json();
    const vercelUrl = `https://${vercelData.url}`;

    return NextResponse.json({
      url: vercelUrl,
      slug: slug,
    });
  } catch (error) {
    console.error("Publish API error:", error);
    return NextResponse.json(
      { error: error.message || "Publishing failed" },
      { status: 500 }
    );
  }
}

