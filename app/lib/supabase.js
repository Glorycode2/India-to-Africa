export async function getSharedSb() {
  if (globalThis.__abSb) return globalThis.__abSb;
  const { createClient } = await import("@supabase/supabase-js");
  if (!globalThis.__abSb) {
    globalThis.__abSb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }
  return globalThis.__abSb;
}