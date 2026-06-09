"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Hook para efecto tilt 3D al hover. Respeta prefers-reduced-motion.
// maxDeg: inclinación máxima en grados (recomendado 8-10)
export function useTilt(maxDeg = 8) {
  const ref = useRef(null);
  const frame = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      if (reduced || !ref.current) return;
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        ref.current.style.transition = "transform 0.05s linear";
        ref.current.style.transform = `perspective(900px) rotateX(${-y * maxDeg * 2}deg) rotateY(${x * maxDeg * 2}deg) translateZ(12px)`;
      });
    },
    [reduced, maxDeg]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    ref.current.style.transition = "transform 0.6s cubic-bezier(.2,.7,.2,1)";
    ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
