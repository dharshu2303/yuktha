// Persistent storage using Supabase with in-memory fallback
import { supabase } from "./supabase";

// In-memory fallback (used when Supabase is unavailable)
const siteStore = new Map();

export async function saveSite(slug, html, metaTags = {}) {
  if (supabase) {
    try {
      const { error } = await supabase.from("sites").insert({
        slug,
        html,
        meta_tags: metaTags,
      });
      if (error) {
        console.warn("Supabase insert failed, using memory fallback:", error.message);
        siteStore.set(slug, { html, metaTags, createdAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn("Supabase unreachable, using memory fallback:", err.message);
      siteStore.set(slug, { html, metaTags, createdAt: new Date().toISOString() });
    }
  } else {
    siteStore.set(slug, { html, metaTags, createdAt: new Date().toISOString() });
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
      return data ? { html: data.html, metaTags: data.meta_tags, createdAt: data.created_at } : null;
    } catch (err) {
      console.warn("Supabase unreachable, trying memory fallback:", err.message);
      return siteStore.get(slug) || null;
    }
  }
  return siteStore.get(slug) || null;
}

export function generateSlug() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}
