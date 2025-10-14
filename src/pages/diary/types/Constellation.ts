import type { Coordinate } from "./Coordinate";

type Day = number;

export interface Constellation {
  star: Coordinate;
  text?: Coordinate;
  big: boolean;
}

export type MonthConstellation = Record<Day, Constellation>;
