// FrogNotiModal.jsx
import { useEffect } from "react";

import frogCompl from "@/assets/images/frog-sleep.svg";

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
        topText={`오늘의 여정이 끝났어요.\n오늘도 수고 많았어요!`}
        imageSrc={frogCompl}
        bottomText={`개구리가 내일의 여정을 위해\n쉬고 있어요`}
      />
    </PageModal>
  );
}
