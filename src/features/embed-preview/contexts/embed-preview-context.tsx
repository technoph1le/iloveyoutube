"use client";

import { createContext, FormEvent, ReactNode, useState } from "react";
import type { EmbedPreviewContextType } from "../types";

export const EmbedPreviewContext = createContext<EmbedPreviewContextType>({
  videoURL: "",
  setVideoURL: () => {},
  isAutoplay: false,
  setIsAutoplay: () => {},
  isLoop: false,
  setIsLoop: () => {},
  isMute: false,
  setIsMute: () => {},
  hasControls: false,
  setHasControls: () => {},
  isResponsive: false,
  setIsResponsive: () => {},
  startTime: "",
  setStartTime: () => {},
  endTime: "",
  setEndTime: () => {},
  handleSubmit: () => {},
  handleReset: () => {},
});

export const EmbedPreviewContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [videoURL, setVideoURL] = useState("");
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [hasControls, setHasControls] = useState(false);
  const [isResponsive, setIsResponsive] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleReset() {
    setVideoURL("");
    setIsAutoplay(false);
    setIsLoop(false);
    setIsMute(false);
    setHasControls(false);
    setIsResponsive(false);
    setStartTime("");
    setEndTime("");
  }

  return (
    <EmbedPreviewContext.Provider
      value={{
        videoURL,
        setVideoURL,
        isAutoplay,
        setIsAutoplay,
        isLoop,
        setIsLoop,
        isMute,
        setIsMute,
        hasControls,
        setHasControls,
        isResponsive,
        setIsResponsive,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        handleSubmit,
        handleReset,
      }}
    >
      {children}
    </EmbedPreviewContext.Provider>
  );
};
