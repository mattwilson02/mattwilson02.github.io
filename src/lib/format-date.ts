const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Deterministic date formatting.
 *
 * `toLocaleDateString` renders using the runtime's locale and timezone, so the
 * server (UTC) and the browser (whatever the reader is in) produce different
 * strings — which is a React hydration mismatch. These parse the ISO string
 * directly and never touch the Date object's timezone handling.
 *
 * Input is always "YYYY-MM-DD".
 */
function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

/** e.g. "23 Mar 2026" */
export function formatDateShort(iso: string): string {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** e.g. "23 March 2026" */
export function formatDateLong(iso: string): string {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS_LONG[m - 1]} ${y}`;
}
