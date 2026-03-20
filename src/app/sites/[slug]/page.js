import { getSite } from "@/lib/storage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const site = await getSite(resolvedParams.slug);
  if (!site) return { title: "Not Found" };

  return {
    title: site.metaTags?.title || "Yuktha Site",
    description: site.metaTags?.description || "",
    keywords: site.metaTags?.keywords || "",
  };
}

export default async function SitePage({ params }) {
  const resolvedParams = await params;
  const site = await getSite(resolvedParams.slug);

  if (!site) {
    notFound();
  }

  // The generated HTML is a complete standalone document.
  // Render it as a full-page iframe to avoid nested <html> within the Next.js layout.
  const encodedHtml = Buffer.from(site.html).toString("base64");

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999 }}>
      <iframe
        src={`data:text/html;base64,${encodedHtml}`}
        title={site.metaTags?.title || "Yuktha Site"}
        style={{ width: "100%", height: "100%", border: "none" }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
