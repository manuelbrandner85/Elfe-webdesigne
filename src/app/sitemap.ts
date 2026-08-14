import type { MetadataRoute } from "next";
import { site, subPages, paketDetails, caseStudies } from "@/data/content";

/* Die Sitemap entsteht aus denselben Daten wie die Seiten selbst.

   Vorher lag sie als feste Datei unter public/ — mit der Domain an
   vierzehn Stellen im Klartext. Genau daraus entsteht der Fehler, den
   niemand bemerkt: Beim Wechsel auf eine andere Adresse bleibt eine
   Aufzählung stehen, die auf die alte zeigt. Jetzt gibt es eine einzige
   Quelle, nämlich site.url, und die Liste kann nicht mehr veralten,
   wenn eine Unterseite dazukommt. */
const heute = new Date();

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const eintrag = (
    pfad: string,
    prioritaet: number,
    haeufigkeit: "monthly" | "yearly",
  ) => ({
    url: `${site.url}${pfad}`,
    lastModified: heute,
    changeFrequency: haeufigkeit,
    priority: prioritaet,
  });

  return [
    eintrag("/", 1, "monthly"),
    ...subPages.map((p) => eintrag(`/${p.slug}/`, 0.9, "monthly")),
    ...paketDetails.map((p) => eintrag(`/pakete/${p.slug}/`, 0.8, "monthly")),
    ...caseStudies.map((c) => eintrag(`/referenzen/${c.slug}/`, 0.7, "yearly")),
    eintrag("/geschichte/", 0.6, "yearly"),
    eintrag("/impressum/", 0.3, "yearly"),
    eintrag("/datenschutz/", 0.3, "yearly"),
    eintrag("/agb/", 0.3, "yearly"),
  ];
}
