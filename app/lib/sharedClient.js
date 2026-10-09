import { createClient } from "@supabase/supabase-js";

export function getSharedClient() {
  const g = globalThis;
  if (!g.__abSupabase) {
    g.__abSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }
  return g.__abSupabase;
}