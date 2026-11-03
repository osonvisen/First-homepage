// Shape of the content files in src/content. The fields are edited in Pages CMS (see .pages.yml).
export type Lang = "nb" | "en";

export interface Link { label: string; url: string }

/** The folder the game is published in (public/<id>/), also the key of its progress record. */
export type GameId = string & { readonly __brand: "GameId" };
export type GameLanguages = "SQL" | "Python + SQL";
export type Difficulty = 1 | 2 | 3;

export interface Shared {
  name: string;
  image?: string;
  location?: string;
  openToWork?: boolean;
  emailUser?: string;
  emailDomain?: string;
  links?: Link[];
  /** In recommended order. */
  games?: Game[];
}

export interface NowItem { label: string; title: string; text: string }
export interface Project { company?: string; note?: string; title: string; highlights?: string[]; tags?: string }
export interface Experience { period: string; place: string; role: string; current?: boolean }
export interface StackGroup { group: string; tools: string }
export interface Game { id: GameId; languages: GameLanguages; difficulty: Difficulty; available: boolean }
export interface GameText { id: GameId; title: string; description: string; skills: string; studyFit: string }
/** A game's facts and its text in one language, ready to show. */
export interface GameCard extends Game, Omit<GameText, "id"> { url: string }

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
  gamesPageIntro?: string;
  progressNote?: string;
  games?: GameText[];
  contactTitle?: string;
  contactText?: string;
}

export interface PortraitSrc { small: string; large: string }
export interface PageData { lang: Lang; shared: Shared; text: Text; portrait?: PortraitSrc; games: GameCard[] }
