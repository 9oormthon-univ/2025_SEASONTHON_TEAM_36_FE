// FrogNotiModal.jsx
import { useEffect } from "react";

import frogStart from "@/assets/images/frog-running-start.svg";

import FrogNoti from "../../../common/components/FrogNoti";
import PageModal from "../../../common/components/PageModal";

/**
 * PageModal + FrogNoti 조합 컴포넌트
 */
export default function DayStartSplash({ open, onClose }: { open: boolean; onClose?: () => void }) {
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
        topText={`개구리의 여정이 시작되었어요!\n오늘도 화이팅!`}
        imageSrc={frogStart}
        bottomText={`개구리가 도움닫기를\n시도하고 있어요`}
      />
    </PageModal>
  );
}
