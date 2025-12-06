"use client";

import { useContext } from "react";
import { ArrowRightIcon, RotateCcwIcon, TriangleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UploadCard from "@/components/widgets/upload-card";

import { ThumbnailPreviewFormContext } from "../../contexts/thumbnail-preview-form-context";

export default function ThumbnailPreviewForm() {
  const {
    title,
    setTitle,
    channel,
    setChannel,
    thumbnail,
    setThumbnail,
    error,
    handleSubmit,
    handleReset,
  } = useContext(ThumbnailPreviewFormContext);

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 items-center lg:grid-cols-2"
    >
      <UploadCard img={thumbnail} setImg={setThumbnail} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="video-title">Video title</FieldLabel>
          <Input
            id="video-title"
            autoComplete="off"
            placeholder="e.g. The Ultimate YouTube Guide"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="md:text-base h-auto py-2 px-4"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="channel-name">Channel Name</FieldLabel>
          <Input
            id="channel-name"
            autoComplete="off"
            placeholder="e.g. PewDiePie"
            name="channel"
            required
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="md:text-base h-auto py-2 px-4"
          />
        </Field>
        {error ? (
          <FieldDescription className="text-destructive flex gap-2 items-center">
            <TriangleAlertIcon size={20} />
            <span>{error}</span>
          </FieldDescription>
        ) : null}
        <Field orientation="horizontal">
          <Button
            type="reset"
            variant="outline"
            size="lg"
            onClick={handleReset}
          >
            <RotateCcwIcon />
            <span>Reset</span>
          </Button>
          <Button type="submit" size="lg">
            <span>Preview</span>
            <ArrowRightIcon />
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
