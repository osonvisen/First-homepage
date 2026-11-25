import type { Lang } from "./types";

/**
 * The files are in public/downloads. Keep the names when a CV is replaced, so old links still work.
 * Partial: a language without a CV gets no download button.
 */
export const CV_PATHS: Partial<Record<Lang, string>> = {
  nb: "/downloads/CV_Orjan_Sonvisen_no.pdf",
};
