// The games write a small progress record that this site reads. The format is agreed in
// sql-games/docs/progress-record.md: {"version":1,"status":"started"|"solved"}.
export type GameProgress = "notStarted" | "started" | "solved";

type RecordedStatus = Exclude<GameProgress, "notStarted">;

const RECORD_VERSION = 1;
const RECORDED_STATUSES: readonly RecordedStatus[] = ["started", "solved"];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isRecordedStatus = (value: unknown): value is RecordedStatus =>
  RECORDED_STATUSES.some((status) => status === value);

/**
 * Turns the stored text into a status. A missing, damaged or unknown record counts as not started,
 * so the page never fails because of what is in the visitor's browser.
 */
export function parseProgress(raw: string | null): GameProgress {
  if (raw === null) return "notStarted";
  let record: unknown;
  try {
    record = JSON.parse(raw);
  } catch {
    return "notStarted"; // Not JSON: treated as no record, as the format agreement says.
  }
  if (!isObject(record) || record.version !== RECORD_VERSION) return "notStarted";
  return isRecordedStatus(record.status) ? record.status : "notStarted";
}
