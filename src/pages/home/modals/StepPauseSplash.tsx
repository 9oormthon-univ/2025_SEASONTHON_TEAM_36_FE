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
        topText={`스텝 잠깐 정지...`}
        imageSrc={frogSwim}
        bottomText={`개구리가 잠시 숨을 돌리고 있어요`}
      />
    </PageModal>
  );
}
