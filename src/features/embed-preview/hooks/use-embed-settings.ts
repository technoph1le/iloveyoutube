"use client";

import {
  MonitorSmartphoneIcon,
  PlayCircleIcon,
  RepeatIcon,
  SlidersHorizontalIcon,
  VolumeXIcon,
} from "lucide-react";
import { useContext } from "react";
import { EmbedPreviewContext } from "../contexts/embed-preview-context";

export default function useEmbedSettings() {
  const {
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
  } = useContext(EmbedPreviewContext);

  return [
    {
      label: "Autoplay",
      id: "autoplay",
      icon: PlayCircleIcon,
      checked: isAutoplay,
      onChange: (e: boolean) => setIsAutoplay(e),
    },
    {
      label: "Loop",
      id: "loop",
      icon: RepeatIcon,
      checked: isLoop,
      onChange: (e: boolean) => setIsLoop(e),
    },
    {
      label: "Mute",
      id: "mute",
      icon: VolumeXIcon,
      checked: isMute,
      onChange: (e: boolean) => setIsMute(e),
    },
    {
      label: "Controls",
      id: "controls",
      icon: SlidersHorizontalIcon,
      checked: hasControls,
      onChange: (e: boolean) => setHasControls(e),
    },
    {
      label: "Responsive",
      id: "responsive",
      icon: MonitorSmartphoneIcon,
      checked: isResponsive,
      onChange: (e: boolean) => setIsResponsive(e),
    },
  ];
}
