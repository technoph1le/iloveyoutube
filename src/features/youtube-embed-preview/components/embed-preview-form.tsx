"use client";

import { useContext } from "react";
import { EmbedPreviewContext } from "../contexts/embed-preview-context";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  ArrowRightIcon,
  ListEndIcon,
  ListStartIcon,
  PlayCircleIcon,
  RepeatIcon,
  SlidersHorizontalIcon,
  VolumeXIcon,
} from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function EmbedPreviewForm() {
  const {
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
  } = useContext(EmbedPreviewContext);

  const EMBED_PREVIEW_SETTINGS = [
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
  ];

  return (
    <form onSubmit={handleSubmit} className="py-6">
      <InputGroup className="max-w-lg mx-auto">
        <InputGroupInput
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
          placeholder="Paste the YouTube video link"
          required
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" aria-label="See embed preview">
            <ArrowRightIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <FieldGroup className="flex gap-4 flex-row flex-wrap items-center py-6">
        {EMBED_PREVIEW_SETTINGS.map(({ icon: Icon, ...setting }) => (
          <Field
            orientation="horizontal"
            className="relative flex w-40 cursor-pointer items-center gap-4 rounded-md border border-input p-4 outline-none has-data-[state=checked]:border-primary/50"
            key={setting.id}
          >
            <Icon size={20} />
            <FieldLabel htmlFor={setting.id}>{setting.label}</FieldLabel>
            <Checkbox
              className="block after:absolute after:inset-0"
              id={setting.id}
              checked={setting.checked}
              onCheckedChange={(e) => setting.onChange(e as boolean)}
            />
          </Field>
        ))}
        <Field
          orientation="horizontal"
          className="flex items-center justify-between w-fit gap-4 py-2 px-4 rounded-md border"
        >
          <ListStartIcon size={20} />
          <FieldLabel htmlFor="startTime">Start</FieldLabel>
          <Input
            type="number"
            id="startTime"
            className="w-30"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </Field>
        <Field
          orientation="horizontal"
          className="flex items-center justify-between w-fit gap-4 py-2 px-4 rounded-md border"
        >
          <ListEndIcon size={20} />
          <FieldLabel htmlFor="endTime">End</FieldLabel>
          <Input
            type="number"
            id="endTime"
            className="w-30"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </Field>
      </FieldGroup>
    </form>
  );
}
