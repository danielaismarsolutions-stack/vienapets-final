"use client";

// Adaptador del useRoute legacy (hash-based) sobre next/navigation.
// Conserva la API { route, go } para que los componentes migrados de shared.jsx,
// home.jsx y pages.jsx funcionen sin modificaciones en su lógica.
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useRoute() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const search = useSearchParams();
  const q = search ? search.toString() : "";
  const route = q ? `${pathname}?${q}` : pathname;
  const go = (path) => router.push(path);
  return { route, go };
}

// El RouteProvider del legacy era un Context. En Next.js el router es global,
// así que aquí es un no-op que solo renderiza children. Se mantiene por simetría
// con la API legacy.
export function RouteProvider({ children }) {
  return children;
}
