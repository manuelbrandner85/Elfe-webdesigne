import type { MetadataRoute } from "next";
import { site } from "@/data/content";

/* Der Verweis auf die Sitemap trug die Domain früher im Klartext. Er
   kommt jetzt aus derselben Quelle wie alles andere.

   Die Vorschau bei GitHub Pages überschreibt diese Datei im Arbeitsablauf
   mit einer Sperre — erkennbar am fehlenden CNAME. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
