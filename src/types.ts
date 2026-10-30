// Shape of the content files in src/content. The fields are edited in Pages CMS (see .pages.yml).
export type Lang = "nb" | "en";

export interface Link { label: string; url: string }

export interface Shared {
  name: string;
  image?: string;
  location?: string;
  openToWork?: boolean;
  emailUser?: string;
  emailDomain?: string;
  links?: Link[];
}

export interface NowItem { label: string; title: string; text: string }
export interface Project { company?: string; note?: string; title: string; highlights?: string[]; tags?: string }
export interface Experience { period: string; place: string; role: string; current?: boolean }
export interface StackGroup { group: string; tools: string }
export interface Game { title: string; description?: string; url?: string; status?: string; skills?: string }

export interface Text {
  role: string;
  roleDetail?: string;
  status?: string;
  intro?: string;
  lookingFor?: string;
  now?: NowItem[];
  projects?: Project[];
  experience?: Experience[];
  about?: string;
  beforeCode?: string;
  stack?: StackGroup[];
  gamesIntro?: string;
  games?: Game[];
  contactTitle?: string;
  contactText?: string;
}

export interface PortraitSrc { small: string; large: string }
export interface PageData { lang: Lang; shared: Shared; text: Text; portrait?: PortraitSrc }
