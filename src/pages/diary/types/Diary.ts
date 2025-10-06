// UI 구현을 위한 더미 데이터 타입 정의
// 추후 삭제 예정

export interface Diary {
  id: number;
  prevEmotion: number;
  energy: number;
  place: number;
  emotion: number;
  concentration: number;
  perfection: number;
  memo: string;
  url: string;
  date: string;
}

export type DummyData = Record<string, Diary>;
