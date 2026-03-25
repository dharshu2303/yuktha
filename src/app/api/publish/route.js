import { NextResponse } from "next/server";
import { saveSite, generateUniqueSlug } from "@/lib/storage";

export async function POST(request) {
  try {
    const { htmlContent, previewContent, metaTags, businessName } = await request.json();

    if (!htmlContent) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(businessName);
    
    // Save to Supabase (keeps a record)
    await saveSite(slug, htmlContent, previewContent || htmlContent, metaTags || {});

    // Deploy to Vercel dynamically
    if (!process.env.VERCEL_TOKEN) {
      console.warn("VERCEL_TOKEN not set, fallback to local URL");
      const url = `https://${slug}.yuktha.online`;
      return NextResponse.json({ url, localUrl: `${url}?lang=local`, slug });
    }

    const vercelResponse = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: `yuktha-site-${slug}`,
        target: "production",
        files: [
          {
            file: "index.html",
            data: htmlContent
          },
          {
            file: "local.html",
            data: previewContent || htmlContent
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

    // Disable Vercel Authentication on this project so anyone can view it
    const projectId = vercelData.projectId;
    if (projectId) {
      try {
        await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ssoProtection: null
          })
        });
      } catch (e) {
        console.warn("Could not disable deployment protection:", e.message);
      }
    }

    const customDomainUrl = `https://${slug}.yuktha.online`;

    return NextResponse.json({
      url: customDomainUrl,
      localUrl: `${customDomainUrl}?lang=local`,
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

