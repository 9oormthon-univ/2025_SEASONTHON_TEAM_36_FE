import React from "react";
import PageModal from "../../../common/components/PageModal";

/**
 * DailyCheckInModal
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - title: string
 *  - step: { id, title } | null
 *  - isPlaying: boolean
 */
export default function DailyCheckInModal({ open, onClose, title, step, isPlaying }) {
  return (
    <PageModal
      open={open}
      onClose={onClose}
    >
      <h3 className="typo-h3" style={{ margin: 0, color: "var(--text-1)" }}>
        {title ?? "목표"}
      </h3>
      <p style={{ margin: "6px 0 12px", color: "var(--text-2)" }}>
        선택한 스텝:{" "}
        <strong style={{ color: "var(--text-1)" }}>
          {step?.title ?? "-"}
        </strong>
      </p>
      <p style={{ margin: 0, color: "var(--text-2)" }}>
        진행 상태:{" "}
        <strong style={{ color: "var(--text-1)" }}>
          {isPlaying ? "진행 중" : "일시정지"}
        </strong>
      </p>
    </PageModal>
  );
}
