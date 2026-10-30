// Formen på innholdsfilen src/content/forside.json.
// Feltene redigeres i Pages CMS (se .pages.yml).
export type Status = "Klar" | "Prototype" | "Kommer snart";

export interface Lenke {
  tekst: string;
  url: string;
}

export interface Prosjekt {
  tittel: string;
  beskrivelse?: string;
  lenke?: string;
  status?: Status;
  ferdigheter?: string;
  bilde?: string;
}

export interface Forside {
  navn: string;
  tittel?: string;
  bilde?: string;
  intro?: string;
  lenker?: Lenke[];
  prosjekter?: Prosjekt[];
}
