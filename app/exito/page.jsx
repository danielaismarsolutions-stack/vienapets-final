import { Suspense } from "react";
import { ExitoPage } from "@/components/pages/ExitoPage";

// useSearchParams requiere un límite de Suspense en el App Router.
export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "140px 40px", textAlign: "center", color: "var(--vp-ink-muted)" }} className="vp-eyebrow">Cargando…</div>}>
      <ExitoPage />
    </Suspense>
  );
}
