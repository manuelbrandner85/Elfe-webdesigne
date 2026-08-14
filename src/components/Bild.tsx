import type { CSSProperties } from "react";

/* Ein Bild in zwei Formaten.

   next/image kann das hier nicht leisten: Der Bau ist ein statischer
   Export mit `images.unoptimized`, next/image gibt dann ein schlichtes
   <img> aus — ein Format, eine Datei. Zwei Formate brauchen <picture>.

   Der Gewinn ist kein Feinschliff. Über den Bildbestand dieser Seite
   liegt er bei 42 Prozent, beim Logo — der größten Einzeldatei der
   Startseite — bei 53. Die AVIF-Fassungen erzeugt werkzeug/bilder.mjs
   und legt sie neben die WebP-Dateien; wer keins versteht, bekommt
   weiterhin WebP.

   Zwei Betriebsarten, wie bei next/image:
     füllend  — das Bild legt sich über den Elternkasten (position: relative)
     fest     — Breite und Höhe stehen fest und halten den Platz frei */
type Grund = {
  /** Pfad zur WebP-Fassung; die AVIF-Fassung wird daneben erwartet */
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** true für Bilder oberhalb der Falz — lädt sofort statt verzögert */
  priority?: boolean;
  style?: CSSProperties;
  /* Mehrere Breiten derselben Datei, z. B. [360, 640]. Erwartet wird die
     Benennung `name-BREITE.webp`; der Pfad in `src` nennt eine davon. */
  breiten?: number[];
  /* Fehlt die Datei, soll der Aufrufer umschalten können — die
     Dienstleistungskarten zeigen dann ihr Goldmedaillon statt einer
     kaputten Bildkachel. */
  onError?: () => void;
};

type Fuellend = Grund & { fill: true; width?: never; height?: never };
type Fest = Grund & { fill?: false; width: number; height: number };

export default function Bild({
  src,
  alt,
  className,
  sizes,
  priority = false,
  style,
  onError,
  breiten,
  fill,
  width,
  height,
}: Fuellend | Fest) {
  const avif = src.replace(/\.(webp|jpe?g|png)$/i, ".avif");

  /* Aus `bild-640.webp` wird `bild-360.avif 360w, bild-640.avif 640w`.
     Ohne Breitenliste bleibt es bei einer Datei — dann steht kein
     srcSet im Markup und der Browser nimmt schlicht `src`. */
  const satz = (endung: string) =>
    breiten
      ?.map((b) => `${src.replace(/-\d+\.(webp|jpe?g|png)$/i, `-${b}.${endung}`)} ${b}w`)
      .join(", ");

  /* Die füllende Betriebsart braucht die Maße als Stil, nicht als
     Attribut — sonst überschreibt das Attribut die Positionierung. */
  const fuellStil: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
    : undefined;

  return (
    <picture className={fill ? "contents" : undefined}>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        // fetchPriority steuert die Reihenfolge; ohne das lädt das Logo
        // im Kopf hinter Bildern, die noch gar nicht sichtbar sind.
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        onError={onError}
        draggable={false}
        className={className}
        style={{ ...fuellStil, ...style }}
      />
    </picture>
  );
}
