// src/pages/home/utils/dates.js

/** YYYY-MM-DD (로컬) */
export function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** "2025-09-05" → Date (로컬 자정 기준) */
export function parseISODateLocal(iso) {
  if (!iso || typeof iso !== "string") return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function startOfTodayLocal() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

export function isSameDayLocal(a, b) {
  if (!(a instanceof Date) || !(b instanceof Date)) return false;
  const da = new Date(a); da.setHours(0, 0, 0, 0);
  const db = new Date(b); db.setHours(0, 0, 0, 0);
  return da.getTime() === db.getTime();
}

export function isTodayISO(iso) {
  const dt = parseISODateLocal(iso);
  if (!dt) return false;
  return isSameDayLocal(dt, startOfTodayLocal());
}

export function isFutureISO(iso) {
  const dt = parseISODateLocal(iso);
  if (!dt) return false;
  const today = startOfTodayLocal();
  return dt.getTime() > today.getTime();
}
