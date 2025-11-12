import styled from "styled-components";

import addPhotoIcon from "@/assets/images/add.svg";

export interface PhotoPickerProps {
  photoUrl?: string | null;
  /** “추가” 버튼(placeholder) 클릭 */
  onAddClick?: () => void;
  /** 이미지 클릭(확대/변경 등 UI만) */
  onImageClick?: () => void;
  className?: string;
}

export default function PhotoPicker({
  photoUrl,
  onAddClick,
  onImageClick,
  className,
}: PhotoPickerProps) {
  return (
    <PhotoBox className={className}>
      {photoUrl ? (
        <Placeholder
          onClick={onImageClick}
          style={{ cursor: onImageClick ? "pointer" : "default" }}
        >
          <img src={photoUrl} alt="기록 사진" />
        </Placeholder>
      ) : (
        <Placeholder onClick={onAddClick} style={{ cursor: onAddClick ? "pointer" : "default" }}>
          <img src={addPhotoIcon} alt="추가" />
        </Placeholder>
      )}
    </PhotoBox>
  );
}

export const PhotoBox = styled.div`
  width: 100%;
  height: 150px;
  background: var(--natural-200);
  border: 1px solid var(--natural-200);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 50px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Placeholder = styled.div<{ $isPhoto?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
