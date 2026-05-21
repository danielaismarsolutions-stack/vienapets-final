import "server-only";

// Cliente Supabase server-side con SUPABASE_SERVICE_ROLE_KEY.
// Bypassa RLS — usar exclusivamente desde Route Handlers, Server Actions o
// procesos server-only (Sprint 3+: webhooks de Stripe, decremento de stock).
//
// `server-only` hace que el build falle si este módulo se importa desde un
// Client Component. La service_role key NUNCA debe llegar al navegador.
import { createClient } from "@supabase/supabase-js";

let _client = null;

export function getServiceSupabase() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no definidos");
  }
  _client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
