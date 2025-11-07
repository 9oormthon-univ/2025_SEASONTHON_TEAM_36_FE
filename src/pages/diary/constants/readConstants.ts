import angry from "@/assets/images/emotions/angry.svg";
import blue from "@/assets/images/emotions/blue.svg";
import disappointed from "@/assets/images/emotions/disappointed.svg";
import excited from "@/assets/images/emotions/excited.svg";
import frustrated from "@/assets/images/emotions/frustrated.svg";
import hollow from "@/assets/images/emotions/hollow.svg";
import joy from "@/assets/images/emotions/joy.svg";
import love from "@/assets/images/emotions/love.svg";
import peace from "@/assets/images/emotions/peace.svg";
import soso from "@/assets/images/emotions/soso.svg";
import face1 from "@/assets/images/frog-face-1.svg";
import face2 from "@/assets/images/frog-face-2.svg";
import face3 from "@/assets/images/frog-face-3.svg";
import face4 from "@/assets/images/frog-face-4.svg";
import face5 from "@/assets/images/frog-face-5.svg";
import perfection100 from "@/assets/images/perfection/perfection100.svg";
import perfection20 from "@/assets/images/perfection/perfection20.svg";
import perfection40 from "@/assets/images/perfection/perfection40.svg";
import perfection60 from "@/assets/images/perfection/perfection60.svg";
import perfection80 from "@/assets/images/perfection/perfection80.svg";

interface Info {
  img: string;
  text: string;
}

export const PREV_EMOTION: Record<number, Info> = {
  0: {
    img: face1,
    text: "매우 좋지 않음",
  },
  1: {
    img: face2,
    text: "좋지 않음",
  },
  2: {
    img: face3,
    text: "보통",
  },
  3: {
    img: face4,
    text: "좋음",
  },
  4: {
    img: face5,
    text: "매우 좋음",
  },
};

export const ENERGY: Record<number, Info> = {
  0: {
    img: face1,
    text: "기운 없음",
  },
  1: {
    img: face2,
    text: "기운 조금",
  },
  2: {
    img: face3,
    text: "보통",
  },
  3: {
    img: face4,
    text: "에너지 조금",
  },
  4: {
    img: face5,
    text: "에너지 넘침",
  },
};

export const CONCENTRATION: Record<number, Info> = {
  0: {
    img: face1,
    text: "산만함",
  },
  1: {
    img: face2,
    text: "살짝 집중",
  },
  2: {
    img: face3,
    text: "집중됨",
  },
  3: {
    img: face4,
    text: "몰입",
  },
  4: {
    img: face5,
    text: "초집중",
  },
};

export const EMOTION: Record<number, Info> = {
  0: {
    img: joy,
    text: "즐거웠어",
  },
  1: {
    img: love,
    text: "설렜어",
  },
  2: {
    img: peace,
    text: "평온했어",
  },
  3: {
    img: soso,
    text: "그저그래",
  },
  4: {
    img: excited,
    text: "짜릿했어",
  },
  5: {
    img: frustrated,
    text: "답답했어",
  },
  6: {
    img: blue,
    text: "우울했어",
  },
  7: {
    img: hollow,
    text: "허무했어",
  },
  8: {
    img: angry,
    text: "화가났어",
  },
  9: {
    img: disappointed,
    text: "실망했어",
  },
};

export const PERFECTION: Record<number, string> = {
  0: perfection20,
  1: perfection40,
  2: perfection60,
  3: perfection80,
  4: perfection100,
};
