// Formen på innholdsfilene i src/content. Feltene redigeres i Pages CMS (se .pages.yml).
export type Lang = "nb" | "en";

export interface Lenke { tekst: string; url: string }

export interface Felles {
  navn: string;
  bilde?: string;
  sted?: string;
  apenForJobb?: boolean;
  epostBruker?: string;
  epostDomene?: string;
  lenker?: Lenke[];
}

export interface Naa { etikett: string; tittel: string; tekst: string }
export interface Prosjekt { firma?: string; merknad?: string; tittel: string; punkter?: string[]; tagger?: string }
export interface Erfaring { periode: string; sted: string; rolle: string; pagaende?: boolean }
export interface Stack { gruppe: string; verktoy: string }
export interface Spill { tittel: string; beskrivelse?: string; lenke?: string; status?: string; ferdigheter?: string }

export interface Tekst {
  rolle: string;
  rolleDetalj?: string;
  status?: string;
  ingress?: string;
  serEtter?: string;
  naa?: Naa[];
  prosjekter?: Prosjekt[];
  erfaring?: Erfaring[];
  omMeg?: string;
  forKoden?: string;
  stack?: Stack[];
  spillIngress?: string;
  spill?: Spill[];
  kontaktTittel?: string;
  kontaktTekst?: string;
}

export interface SideData { lang: Lang; felles: Felles; tekst: Tekst; bildeSrc?: { small: string; large: string } }
