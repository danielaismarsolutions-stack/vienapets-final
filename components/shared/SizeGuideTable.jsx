"use client";

import { VP_SIZES } from "@/lib/data";
import { useReveal } from "@/lib/hooks/useReveal";
import styles from "./SizeGuideTable.module.css";

export function SizeGuideTable({ variant = "probador" }) {
  const [ref, visible] = useReveal();

  return (
    <section
      ref={ref}
      className={`${styles.wrapper} ${styles.reveal} ${visible ? styles.visible : ""}`}
      data-variant={variant}
    >
      <p className={styles.eyebrow}>Guía de tallas</p>
      <h2 className={styles.title}>
        Encuentra la talla <span style={{ fontStyle: "italic" }}>perfecta</span>
      </h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Talla</th>
            <th>Cuello (cm)</th>
            <th>Pecho (cm)</th>
          </tr>
        </thead>
        <tbody>
          {VP_SIZES.map((s) => (
            <tr key={s.size}>
              <td><span className={styles.sizeCell}>{s.size}</span></td>
              <td>{s.neck}</td>
              <td>{s.chest}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.hint}>
        Mide a tu perro con cinta blanda alrededor del cuello y la parte más ancha del pecho.
        Si está entre tallas, elige la mayor.
      </p>
    </section>
  );
}
