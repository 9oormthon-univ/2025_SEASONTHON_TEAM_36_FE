// FrogNotiModal.jsx
import { useEffect } from "react";

import frogCompl from "@/assets/images/frog-complete.svg";

import FrogNoti from "../../../common/components/FrogNoti";
import PageModal from "../../../common/components/PageModal";

/**
 * PageModal + FrogNoti 조합 컴포넌트
 */
export default function GoalCompleteSplash({
  open,
  onClose,
}: {
  open: boolean;
  onClose?: () => void;
}) {
  // open 상태가 true가 되면 3.5초 뒤 자동 닫기
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 3500);

    return () => clearTimeout(timer); // cleanup
  }, [open, onClose]);

  return (
    <PageModal open={open} onClose={onClose} headerVariant="close-right">
      <FrogNoti
        topText={`해낼 줄 알았어요!`}
        imageSrc={frogCompl}
        bottomText={`개구리가 우물 탈출에\n성공했어요!`}
      />
    </PageModal>
  );
}
