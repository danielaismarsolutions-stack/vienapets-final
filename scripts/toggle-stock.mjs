// Helper para pruebas: marca/restaura el stock de una variante.
//   node scripts/toggle-stock.mjs out  ARN-CAPRI-M
//   node scripts/toggle-stock.mjs in   ARN-CAPRI-M
import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, service, { auth: { persistSession: false } });

const [, , mode, sku] = process.argv;
if (!mode || !sku) { console.error("Usage: toggle-stock.mjs <out|in> <SKU>"); process.exit(1); }

const patch = mode === "out" ? { stock: 1, stock_reserved: 1 } : { stock: 10, stock_reserved: 1 };
const { data, error } = await supabase.from("variants").update(patch).eq("sku", sku).select("sku, stock, stock_reserved").single();
if (error) { console.error(error); process.exit(1); }
console.log(`${mode === "out" ? "Marked OUT" : "Restored IN"}:`, data);
