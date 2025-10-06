import { Card, ImageWrapper, Label, Title } from "../styles/InfoCard";

interface InfoCardProps {
  title: string;
  imgSrc: string;
  label: string;
}

/* ===== 재사용 가능한 카드 ===== */
export const InfoCard = ({ title, imgSrc, label }: InfoCardProps) => {
  return (
    <Card>
      <Title className="typo-body-s">{title}</Title>
      <ImageWrapper>
        <img src={imgSrc} alt={label} />
      </ImageWrapper>
      <Label className="typo-body-s">{label}</Label>
    </Card>
  );
};
