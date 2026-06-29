import { LEGAL_CONTACT_EMAIL } from "@/lib/legal-info";

// Componentes compartidos de las páginas legales (Sprint 6).
//
// Todas las páginas legales (/privacidad, /aviso-legal, /condiciones, /cookies)
// usan estas piezas para garantizar una estética coherente: paleta marrón,
// Cormorant (var(--font-serif)) en titulares, Jost (var(--font-body)) en cuerpo,
// container de 720px. Son componentes de servidor (sin hooks): los enlaces
// internos usan <a href> normal (navegación completa, suficiente para legales).
//
// NOTA: el componente ProvisionalBanner se conserva como pieza reutilizable por
// si en el futuro hay que volver a marcar algún documento como provisional. A
// partir del Sprint 7 ya no se renderiza en las páginas legales (la marca lanza
// con estos textos), pero se mantiene disponible para reutilizar.

const BROWN = "var(--vp-brown)";

// Banner de aviso "documento provisional". `sober` lo hace más discreto (se usa
// al pie de página, repetido).
export function ProvisionalBanner({ sober = false }) {
  return (
    <div
      style={{
        background: sober ? "var(--vp-cream-soft)" : "var(--vp-cream-deep)",
        border: `1px solid ${BROWN}`,
        borderRadius: 6,
        padding: sober ? "16px 20px" : "18px 22px",
        margin: sober ? "48px 0 0" : "0 0 40px",
        fontSize: sober ? 13 : 14,
        lineHeight: 1.6,
        color: "var(--vp-ink-soft)",
        fontFamily: "var(--font-body)",
      }}
    >
      <strong style={{ color: BROWN }}>⚠️ Documento provisional</strong>{" "}
      pendiente de revisión legal definitiva. Si tienes cualquier duda,
      contáctanos en{" "}
      <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} style={linkStyle}>
        {LEGAL_CONTACT_EMAIL}
      </a>
      .
    </div>
  );
}

export const linkStyle = {
  color: BROWN,
  borderBottom: `1px solid ${BROWN}`,
  textDecoration: "none",
};

// Enlace coherente (interno o externo). Para externos pasa `external`.
export function LegalLink({ href, children, external = false }) {
  const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={href} style={linkStyle} {...extra}>
      {children}
    </a>
  );
}

export function H2({ children }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 500,
        fontSize: 26,
        color: BROWN,
        margin: "48px 0 16px",
        letterSpacing: 0,
      }}
    >
      {children}
    </h2>
  );
}

export function H3({ children }) {
  return (
    <h3
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: 17,
        color: "var(--vp-ink)",
        margin: "26px 0 10px",
      }}
    >
      {children}
    </h3>
  );
}

export function P({ children }) {
  return (
    <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--vp-ink-soft)", margin: "0 0 16px" }}>
      {children}
    </p>
  );
}

export function UL({ children }) {
  return (
    <ul style={{ margin: "0 0 16px", paddingLeft: 22, fontSize: 16, lineHeight: 1.8, color: "var(--vp-ink-soft)" }}>
      {children}
    </ul>
  );
}

// Tabla simple para la política de cookies. `head` = array de strings,
// `rows` = array de arrays de celdas (string o nodo).
export function LegalTable({ head, rows }) {
  return (
    <div style={{ overflowX: "auto", margin: "0 0 20px" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--vp-ink-soft)",
        }}
      >
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderBottom: `2px solid ${BROWN}`,
                  color: BROWN,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid var(--vp-cream-deep)",
                    verticalAlign: "top",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Envoltorio estándar de una página legal: fondo crema, container 720px,
 * titular Cormorant, fecha de actualización y el contenido.
 */
export function LegalPage({ title, updated, children }) {
  return (
    <main style={{ fontFamily: "var(--font-body)", background: "var(--vp-cream)", padding: "80px 24px 96px" }}>
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1
          className="vp-display"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 600,
            fontSize: 46,
            color: "var(--vp-ink)",
            margin: "0 0 28px",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>

        {updated && (
          <p style={{ fontSize: 14, color: "var(--vp-ink-muted)", margin: "0 0 8px", fontStyle: "italic" }}>
            Última actualización: {updated}
          </p>
        )}

        {children}
      </article>
    </main>
  );
}
