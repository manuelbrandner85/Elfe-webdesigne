import { medien } from "@/lib/pfad";
import Image from "next/image";
import { contact } from "@/data/content";

export default function Footer() {
  return (
    <footer className="pt-16 pb-9 text-center border-t border-line">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 mb-5.5">
          <Image
            src={medien("/images/logo-klein.webp")}
            alt="Webdesign Elfe"
            width={34}
            height={34}
            className="rounded-full"
          />
          <span className="font-serif-display text-[1.1rem]">
            Webdesign{" "}
            <span className="font-script text-gold-bright text-[1.5rem] -ml-0.5 align-[-3px]">
              Elfe
            </span>
          </span>
        </div>

        {/* Kontaktangaben — auf dem Handy untereinander, am Rechner
            eine Zeile mit feinen Trennstrichen. Alle auf einer Mittellinie. */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center text-sm text-silver mb-4">
          {[
            { label: "Telefon", value: contact.phone },
            { label: "E-Mail", value: contact.email, mail: true },
            { label: "WhatsApp", value: contact.whatsapp },
            { label: "Erreichbarkeit", value: contact.hours },
          ].map((item, i, arr) => (
            <span key={item.label} className="inline-flex items-center">
              <span className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1.5 min-h-[40px] px-0 sm:px-4 text-center sm:text-left py-1 sm:py-0">
                <span className="text-gold-bright shrink-0 text-[0.72rem] sm:text-sm tracking-[0.1em] sm:tracking-normal uppercase sm:normal-case">
                  {item.label}
                </span>
                {item.mail ? (
                  <a
                    href={`mailto:${item.value}`}
                    className="inline-flex items-center min-h-[40px] hover:text-gold-bright transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
                )}
              </span>
              {i < arr.length - 1 && (
                <span
                  aria-hidden
                  className="hidden sm:block w-px h-3.5 bg-line shrink-0"
                />
              )}
            </span>
          ))}
        </div>

        {/* Navigation — auf dem Handy zweispaltig, am Rechner eine Zeile */}
        <nav
          aria-label="Fußzeile"
          className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-1 sm:gap-x-2 text-sm mb-5 max-w-md sm:max-w-none mx-auto"
        >
          {[
            { href: "#top", label: "Startseite" },
            { href: "/webdesign", label: "Webdesign" },
            { href: "/logodesign", label: "Logodesign" },
            { href: "#ueber", label: "Über mich" },
            { href: "#portfolio", label: "Referenzen" },
            { href: "#preise", label: "Preise" },
            { href: "#kontakt", label: "Kontakt" },
            { href: "/impressum", label: "Impressum" },
            { href: "/datenschutz", label: "Datenschutz" },
            { href: "/agb", label: "AGB" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="inline-flex items-center justify-center min-h-[44px] px-3 text-silver hover:text-gold-bright transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="text-[0.78rem] text-[#9c958a] tracking-wide">
          © 2026 Webdesign Elfe. Alle Rechte vorbehalten.
        </p>
        <p className="text-[0.78rem] text-[#9c958a] tracking-wide mt-1.5">
          Webdesign Elfe – moderne Webseiten und persönlicher Service.
        </p>
      </div>
    </footer>
  );
}
