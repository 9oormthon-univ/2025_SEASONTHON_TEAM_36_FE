// FrogNotiModal.jsx
import { useEffect } from "react";

import frogSwim from "@/assets/images/frog-swim.svg";

import FrogNoti from "../../../common/components/FrogNoti";
import PageModal from "../../../common/components/PageModal";

/**
 * PageModal + FrogNoti 조합 컴포넌트
 */
export default function PauseSplash({ open, onClose, progress }) {
  // open 상태가 true가 되면 3초 뒤 자동 닫기
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, [open, onClose]);

  return (
    <PageModal open={open} onClose={onClose} headerVariant="close-right">
      <FrogNoti
        topText={`작은 도전이\n큰 변화를 만들어요!`}
        imageSrc={frogSwim}
        bottomText={`Step 하나를 완료했습니다!\n\n개구리가 ${progress}m 올라왔어요`} // 여기
      />
    </PageModal>
  );
}
