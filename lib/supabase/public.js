import "server-only";

// Cliente Supabase para uso desde servidor (Server Components, Route Handlers
// de solo lectura) con la anon key. Las consultas pasan por RLS, así que solo
// pueden leer lo que las policies permiten (productos activos, variants).
//
// `server-only` hace que el build falle si este módulo se importa desde un
// Client Component, garantizando que la lógica server queda en server.
import { createClient } from "@supabase/supabase-js";

let _client = null;

export function getPublicSupabase() {
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
