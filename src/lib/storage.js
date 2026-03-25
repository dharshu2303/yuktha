// Persistent storage using Supabase with in-memory fallback
import { supabase } from "./supabase";

// In-memory fallback (used when Supabase is unavailable)
const siteStore = new Map();

export async function saveSite(slug, html, previewHtml, metaTags = {}) {
  const mergedMetaTags = { ...metaTags, previewHtml };

  if (supabase) {
    try {
      const { error } = await supabase.from("sites").insert({
        slug,
        html,
        meta_tags: mergedMetaTags,
      });
      if (error) {
        console.warn("Supabase insert failed, using memory fallback:", error.message);
        siteStore.set(slug, { html, previewHtml, metaTags: mergedMetaTags, createdAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn("Supabase unreachable, using memory fallback:", err.message);
      siteStore.set(slug, { html, previewHtml, metaTags: mergedMetaTags, createdAt: new Date().toISOString() });
    }
  } else {
    siteStore.set(slug, { html, previewHtml, metaTags: mergedMetaTags, createdAt: new Date().toISOString() });
  }
  return slug;
}

export async function getSite(slug) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.warn("Supabase query failed, trying memory fallback:", error.message);
        return siteStore.get(slug) || null;
      }
      return data ? { html: data.html, metaTags: data.meta_tags, previewHtml: data.meta_tags?.previewHtml, createdAt: data.created_at } : null;
    } catch (err) {
      console.warn("Supabase unreachable, trying memory fallback:", err.message);
      return siteStore.get(slug) || null;
    }
  }
  return siteStore.get(slug) || null;
}

export async function generateUniqueSlug(businessName) {
  let baseSlug = (businessName || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (!baseSlug) baseSlug = "site";
  
  let slug = baseSlug;
  let isUnique = false;
  let counter = 0;
  
  while (!isUnique) {
    if (counter > 0) {
      slug = `${baseSlug}${counter}`;
    }
    const existing = await getSite(slug);
    if (!existing) {
      isUnique = true;
    } else {
      counter++;
    }
  }
  return slug;
}
