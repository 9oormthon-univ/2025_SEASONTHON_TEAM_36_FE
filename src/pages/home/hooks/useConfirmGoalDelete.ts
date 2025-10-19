// src/pages/home/utils/useConfirmGoalDelete.ts
import { useCallback, useState } from "react";

import { deleteTodo } from "@/apis/todo";

interface UseConfirmDeleteParams {
  goalId: number | string | null;
  onDelete?: (goalId: number | string) => void;
  onDeleted?: () => void;
  onClose?: () => void;
}

export function useConfirmGoalDelete({
  goalId,
  onDelete,
  onDeleted,
  onClose,
}: UseConfirmDeleteParams) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openConfirm = useCallback(() => setConfirmOpen(true), []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  const handleConfirmDelete = useCallback(async () => {
    if (goalId == null || deleting) return;
    setDeleting(true);
    try {
      await deleteTodo(goalId as number);
      onDelete?.(goalId);
      onDeleted?.();
      setConfirmOpen(false);
      onClose?.();
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setDeleting(false);
    }
  }, [goalId, deleting, onDelete, onDeleted, onClose]);

  return {
    confirmOpen,
    deleting,
    openConfirm,
    closeConfirm,
    handleConfirmDelete,
  };
}
