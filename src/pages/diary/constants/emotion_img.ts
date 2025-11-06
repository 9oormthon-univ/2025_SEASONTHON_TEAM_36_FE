import star_01_happy from "@/assets/images/stars/star-1.svg";
import star_02_excited from "@/assets/images/stars/star-2.svg";
import star_03_calm from "@/assets/images/stars/star-3.svg";
import star_04_normal from "@/assets/images/stars/star-4.svg";
import star_05_thrilling from "@/assets/images/stars/star-5.svg";
import star_06_frustrated from "@/assets/images/stars/star-6.svg";
import star_07_depressed from "@/assets/images/stars/star-7.svg";
import star_08_empty from "@/assets/images/stars/star-8.svg";
import star_09_angry from "@/assets/images/stars/star-9.svg";
import star_10_disappointed from "@/assets/images/stars/star-10.svg";
import { Mood } from "@/common/types/enums";

export const EMOTION_IMG: Record<Mood, string> = {
  HAPPY: star_01_happy,
  EXCITED: star_02_excited,
  CALM: star_03_calm,
  NORMAL: star_04_normal,
  THRILLING: star_05_thrilling,
  FRUSTRATED: star_06_frustrated,
  DEPRESSED: star_07_depressed,
  EMPTY: star_08_empty,
  ANGRY: star_09_angry,
  DISAPPOINTED: star_10_disappointed,
};
