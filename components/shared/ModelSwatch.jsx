// Renderiza el estampado de cada modelo como SVG, sin estado.
// Usado en cards y bloques sin foto real.

export function ModelSwatch({ model, style, radius = 0 }) {
  const id = `sw-${model.id}`;
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={style} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {model.id === "capri" && (
          <pattern id={id} x="0" y="0" width="28" height="200" patternUnits="userSpaceOnUse">
            <rect width="28" height="200" fill={model.hex.secondary} />
            <rect x="14" width="14" height="200" fill={model.hex.primary} />
          </pattern>
        )}
        {model.id === "peachy" && (
          <pattern id={id} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill={model.hex.primary} />
            <g fill={model.hex.secondary} transform="translate(25 25)">
              <path d="M0 -12 L3 -4 L12 -4 L5 2 L8 12 L0 6 L-8 12 L-5 2 L-12 -4 L-3 -4 Z" />
            </g>
            <g fill={model.hex.secondary} transform="translate(0 0)" opacity=".8">
              <path d="M0 -8 L2 -3 L8 -3 L3 1 L5 8 L0 4 L-5 8 L-3 1 L-8 -3 L-2 -3 Z" />
            </g>
            <g fill={model.hex.secondary} transform="translate(50 50)" opacity=".8">
              <path d="M0 -8 L2 -3 L8 -3 L3 1 L5 8 L0 4 L-5 8 L-3 1 L-8 -3 L-2 -3 Z" />
            </g>
          </pattern>
        )}
        {model.id === "daisy" && (
          <pattern id={id} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect width="28" height="28" fill={model.hex.primary} />
            <circle cx="14" cy="14" r="4" fill={model.hex.secondary} />
            <circle cx="0" cy="0" r="4" fill={model.hex.secondary} />
            <circle cx="28" cy="0" r="4" fill={model.hex.secondary} />
            <circle cx="0" cy="28" r="4" fill={model.hex.secondary} />
            <circle cx="28" cy="28" r="4" fill={model.hex.secondary} />
          </pattern>
        )}
      </defs>
      <rect width="200" height="200" fill={`url(#${id})`} rx={radius} />
    </svg>
  );
}
