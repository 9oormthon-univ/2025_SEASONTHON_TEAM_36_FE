// src/pages/home/utils/storage.js
import { todayKey } from "./dates";

const STORAGE_KEY_PREFIX = "daily-checkin-shown:";

export function getDailyShown() {
  try {
    const key = STORAGE_KEY_PREFIX + todayKey();
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function markDailyShown() {
  try {
    const key = STORAGE_KEY_PREFIX + todayKey();
    localStorage.setItem(key, "1");
  } catch {
    return false;
  }
}
