import { LucideProps } from "lucide-react";
import { ComponentType, Dispatch, FormEvent, SetStateAction } from "react";

export interface EmbedPreviewContextType {
  videoURL: string;
  setVideoURL: Dispatch<SetStateAction<string>>;
  isAutoplay: boolean;
  setIsAutoplay: Dispatch<SetStateAction<boolean>>;
  isLoop: boolean;
  setIsLoop: Dispatch<SetStateAction<boolean>>;
  isMute: boolean;
  setIsMute: Dispatch<SetStateAction<boolean>>;
  hasControls: boolean;
  setHasControls: Dispatch<SetStateAction<boolean>>;
  isResponsive: boolean;
  setIsResponsive: Dispatch<SetStateAction<boolean>>;
  startTime: string;
  setStartTime: Dispatch<SetStateAction<string>>;
  endTime: string;
  setEndTime: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
}

export type SettingFieldType = {
  label: string;
  id: string;
  icon: ComponentType<LucideProps>;
  checked: boolean;
  onChange: (e: boolean) => void;
};

export type TimeFieldType = {
  label: string;
  id: string;
  icon: ComponentType<LucideProps>;
  value: string;
  onChange: (v: string) => void;
};
