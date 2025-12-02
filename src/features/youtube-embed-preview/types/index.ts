import { Dispatch, FormEvent, SetStateAction } from "react";

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
  startTime: string;
  setStartTime: Dispatch<SetStateAction<string>>;
  endTime: string;
  setEndTime: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
}
