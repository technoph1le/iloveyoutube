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
  RotateCcwIcon,
} from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useEmbedSettings from "../hooks/use-embed-settings";
import { SettingFieldType, TimeFieldType } from "../types";

export default function EmbedPreviewForm() {
  const {
    videoURL,
    setVideoURL,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    handleReset,
    handleSubmit,
  } = useContext(EmbedPreviewContext);
  const settings = useEmbedSettings();

  return (
    <form onSubmit={handleSubmit} className="py-6">
      <div className="flex gap-2 items-center max-w-lg mx-auto">
        <InputGroup>
          <InputGroupInput
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder="Paste the YouTube video URL"
            required
            className="md:text-base h-auto py-2 px-4"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton type="submit" aria-label="See embed preview">
              <ArrowRightIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <Button
          type="reset"
          size="icon"
          variant="outline"
          onClick={handleReset}
        >
          <RotateCcwIcon />
        </Button>
      </div>

      <div className="max-w-5xl mx-auto py-4 space-y-4">
        <FieldGroup className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {settings.map((setting) => (
            <SettingField key={setting.id} setting={setting} />
          ))}
        </FieldGroup>

        <FieldGroup className="grid sm:grid-cols-2 gap-4">
          <TimeField
            id="startTime"
            label="Start"
            icon={ListStartIcon}
            value={startTime}
            onChange={setStartTime}
          />

          <TimeField
            id="endTime"
            label="End"
            icon={ListEndIcon}
            value={endTime}
            onChange={setEndTime}
          />
        </FieldGroup>
      </div>
    </form>
  );
}

function SettingField({ setting }: { setting: SettingFieldType }) {
  const Icon = setting.icon;

  return (
    <Field
      orientation="horizontal"
      className="relative grid grid-cols-[auto_1fr_auto] cursor-pointer items-center gap-4 rounded-md border border-input p-4 outline-none has-data-[state=checked]:border-primary/50"
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
  );
}

function TimeField(setting: TimeFieldType) {
  const Icon = setting.icon;

  return (
    <Field
      orientation="horizontal"
      className="grid grid-cols-[auto_1fr_auto] gap-4 py-2 px-4 rounded-md border"
    >
      <Icon size={20} />
      <FieldLabel htmlFor={setting.id}>{setting.label}</FieldLabel>
      <Input
        type="number"
        id={setting.id}
        className="w-30"
        value={setting.value}
        onChange={(e) => setting.onChange(e.target.value)}
      />
    </Field>
  );
}
