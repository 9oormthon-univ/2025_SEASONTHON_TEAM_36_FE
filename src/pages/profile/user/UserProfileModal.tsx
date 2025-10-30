import PageModal from "../../../common/components/PageModal";

interface UserProfileModalProps {
  open: boolean;
  onClose?: () => void;
}

/**
 * 유저 프로필 모달
 */
export default function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  return (
    <PageModal open={open} onClose={onClose} headerVariant="back-left">
      <h1>프로필 페이지</h1>
    </PageModal>
  );
}
