"use client";

import { FormEvent, useContext, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UploadCard from "@/components/widgets/upload-card";
import { ArrowRightIcon, RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import { ThumbnailPreviewContext } from "@/features/thumbnail-previewer/contexts/ThumbnailPreviewContext";
import ThumbnailPreviewViews from "@/features/thumbnail-previewer/components/thumbnail-preview-views";

export default function Page() {
  const { title, setTitle, thumbnail, setThumbnail, channel, setChannel } =
    useContext(ThumbnailPreviewContext);
  const [errorMessage, setErrorMessage] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  function handleUpload(file: File) {
    console.log(file);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!thumbnail) {
      setErrorMessage("Please upload an image.");
      return;
    }

    previewRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleReset() {
    setThumbnail("");
    setTitle("");
    setChannel("");
    setErrorMessage("");
  }

  return (
    <>
      <section>
        <div className="wrapper-xs py-8 space-y-8">
          <h1 className="text-3xl font-bold text-center">
            YouTube Thumbnail Downloader
          </h1>
          <div className="grid gap-4 lg:grid-cols-2">
            <UploadCard
              onUpload={handleUpload}
              thumbnail={thumbnail}
              setThumbnail={setThumbnail}
            />
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="video-title">Video title</FieldLabel>
                  <Input
                    id="video-title"
                    autoComplete="off"
                    placeholder="e.g. The Ultimate YouTube Guide"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="channel-name">Channel Name</FieldLabel>
                  <Input
                    id="channel-name"
                    autoComplete="off"
                    placeholder="e.g. PewDiePie"
                    required
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                  />
                </Field>
                {errorMessage ? (
                  <FieldDescription className="text-destructive flex gap-2 items-center">
                    <TriangleAlertIcon size={20} />
                    <span>{errorMessage}</span>
                  </FieldDescription>
                ) : null}
                <Field orientation="horizontal">
                  <Button type="reset" variant="outline" onClick={handleReset}>
                    <RotateCcwIcon />
                    <span>Reset</span>
                  </Button>
                  <Button type="submit">
                    <span>Preview</span>
                    <ArrowRightIcon />
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </section>
      <section>
        <div className="wrapper-lg py-4 space-y-8" ref={previewRef}>
          <ThumbnailPreviewViews />
        </div>
      </section>
    </>
  );
}
