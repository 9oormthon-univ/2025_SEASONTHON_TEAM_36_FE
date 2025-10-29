// FrogNotiModal.jsx
import { useEffect } from "react";

import frogSwim from "@/assets/images/frog-swim.svg";

import FrogNoti from "../../../common/components/FrogNoti";
import PageModal from "../../../common/components/PageModal";

export default function StepPauseSplash({
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
        topText={`더 높이 뛰기 위해선 잠시\n웅크릴 시간도 필요해요`}
        imageSrc={frogSwim}
        bottomText={`개구리가 잠시 숨을 돌리고 있어요`}
      />
    </PageModal>
  );
}
