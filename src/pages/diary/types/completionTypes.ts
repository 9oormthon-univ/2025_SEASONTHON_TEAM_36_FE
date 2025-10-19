export interface CompletionSelectorProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export interface DotButtonProps {
  $active: boolean;
  $tone: string;
}
