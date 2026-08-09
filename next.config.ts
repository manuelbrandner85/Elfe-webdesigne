import type { NextConfig } from "next";

/* Der Unterpfad wird nur für die Vorschau bei GitHub Pages gesetzt.

   Grund: Pages liefert Projektseiten unter /<Repository>/ aus, Strato
   dagegen unter der Wurzel. Stünde der Pfad fest im Code, wäre eine der
   beiden Auslieferungen immer kaputt. Über die Umgebungsvariable bleibt
   der Quellcode für beide Ziele derselbe. */
const unterpfad = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(unterpfad
    ? { basePath: unterpfad, assetPrefix: unterpfad }
    : {}),
};

export default nextConfig;
