type Day = number;

export type Mood = Record<string, string>;

export interface Coordinate {
  x: number;
  y: number;
}

export interface Constellation {
  star: Coordinate;
  text?: Coordinate;
  big: boolean;
}

export type MonthConstellation = Record<Day, Constellation>;
