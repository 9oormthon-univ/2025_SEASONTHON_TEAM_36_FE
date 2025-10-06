import emo_09_angry from "@/assets/images/emotions/angry.svg";
import emo_07_blue from "@/assets/images/emotions/blue.svg";
import emo_10_disappointed from "@/assets/images/emotions/disappointed.svg";
import emo_05_excited from "@/assets/images/emotions/excited.svg";
import emo_06_frustrated from "@/assets/images/emotions/frustrated.svg";
import emo_08_hollow from "@/assets/images/emotions/hollow.svg";
import emo_01_joy from "@/assets/images/emotions/joy.svg";
import emo_02_love from "@/assets/images/emotions/love.svg";
import emo_03_peace from "@/assets/images/emotions/peace.svg";
import emo_04_soso from "@/assets/images/emotions/soso.svg";
import focus_01 from "@/assets/images/frog-face-1.svg";
import focus_02 from "@/assets/images/frog-face-2.svg";
import focus_03 from "@/assets/images/frog-face-3.svg";
import focus_04 from "@/assets/images/frog-face-4.svg";
import focus_05 from "@/assets/images/frog-face-5.svg";

export interface SelectorItem {
  id: number;
  label: string;
  img: string;
}

export const FOCUSES: SelectorItem[] = [
  { id: 1, label: "산만함", img: focus_01 },
  { id: 2, label: "살짝집중", img: focus_02 },
  { id: 3, label: "집중됨", img: focus_03 },
  { id: 4, label: "몰입", img: focus_04 },
  { id: 5, label: "초집중", img: focus_05 },
];

export const EMOTIONS: SelectorItem[] = [
  { id: 1, label: "즐거웠어", img: emo_01_joy },
  { id: 2, label: "설렜어", img: emo_02_love },
  { id: 3, label: "평온했어", img: emo_03_peace },
  { id: 4, label: "그저그래", img: emo_04_soso },
  { id: 5, label: "짜릿했어", img: emo_05_excited },
  { id: 6, label: "답답했어", img: emo_06_frustrated },
  { id: 7, label: "우울했어", img: emo_07_blue },
  { id: 8, label: "허무했어", img: emo_08_hollow },
  { id: 9, label: "화가났어", img: emo_09_angry },
  { id: 10, label: "실망했어", img: emo_10_disappointed },
];
