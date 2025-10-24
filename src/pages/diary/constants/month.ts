import type { MonthConstellation } from "../types/constellation";
import { AUGUST, NOVEMBER, OCTOBER, SEPTEMBER } from "./constellation";

type MONTH = number;

export const MONTH_CONSTELLATION: Record<MONTH, MonthConstellation> = {
  8: AUGUST,
  9: SEPTEMBER,
  10: OCTOBER,
  11: NOVEMBER,
};
