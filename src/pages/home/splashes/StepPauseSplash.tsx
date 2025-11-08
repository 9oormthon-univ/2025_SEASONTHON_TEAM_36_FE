// FrogNotiModal.jsx
import { useEffect } from "react";

import frogCookie from "@/assets/images/frog-cookie.svg";

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
        topText={`더 높이 뛰기 위해선 잠시\n웅크릴 시간도 필요해요`}
        imageSrc={frogCookie}
        bottomText={`개구리가 잠시 숨을 돌리고 있어요`}
      />
    </PageModal>
  );
}
