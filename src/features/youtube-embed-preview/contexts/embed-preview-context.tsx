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
  hasControls: true,
  setHasControls: () => {},
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
  const [hasControls, setHasControls] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleReset() {
    console.log("reset");
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
