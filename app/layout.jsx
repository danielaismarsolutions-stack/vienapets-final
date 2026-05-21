import { Suspense } from "react";
import { DM_Serif_Display, Cormorant_Garamond, Jost, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { PageFade } from "@/components/shared/PageFade";

// Tipografías de marca cargadas vía next/font/google.
// Cada una expone su CSS variable, que tokens.css consume en --font-* .
const fontDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display-loaded",
  display: "swap",
});

const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-loaded",
  display: "swap",
});

const fontBody = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body-loaded",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata = {
  title: "Viena Pets — Diseño de autor para tu mejor amigo",
  description:
    "Arneses, correas y portabolsas con diseños exclusivos diseñados en España. Edición limitada SS26.",
};

export default function RootLayout({ children }) {
  const fontVars = `${fontDisplay.variable} ${fontSerif.variable} ${fontBody.variable} ${fontMono.variable}`;
  return (
    <html lang="es" className={fontVars}>
      <body>
        <Providers>
          <AnnouncementBar />
          {/* Suspense necesario porque useRoute() llama a useSearchParams(),
              que en Next 14 fuerza CSR si no está dentro de un boundary. */}
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <PageFade>{children}</PageFade>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <Suspense fallback={null}>
            <CartDrawer />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
