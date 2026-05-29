// Cliente Supabase para el navegador (Client Components).
// Usa la anon key — todas las consultas pasan por RLS.
//
// En Sprint 2 no se consume todavía; queda preparado para Client Components
// que necesiten leer en runtime (p. ej. en Sprint 3, refrescos de stock).
import { createClient } from "@supabase/supabase-js";

let _client = null;

export function getBrowserSupabase() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY no definidos");
  }
  _client = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
