"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { ImageUpIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { Card, CardContent } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";

interface Props {
  onUpload: (file: File) => void;
  thumbnail: string;
  setThumbnail: Dispatch<SetStateAction<string>>;
}

export default function UploadCard({
  onUpload,
  thumbnail,
  setThumbnail,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const imgURL = URL.createObjectURL(file);
        setThumbnail(imgURL);
        onUpload(file);
      }
    },
    [setThumbnail, onUpload]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <Card
      {...getRootProps()}
      className={`max-w-md w-full mx-auto py-0 border-dashed border-2 aspect-video overflow-hidden justify-center items-center ${
        (isDragActive || isHovered) && !thumbnail
          ? "border-primary/50 bg-muted"
          : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {thumbnail ? (
        <>
          <AspectRatio ratio={16 / 9} className="w-full h-full">
            <Image
              src={thumbnail}
              alt="Uploaded thumbnail"
              fill
              className="object-cover"
            />
          </AspectRatio>
        </>
      ) : (
        <CardContent className="text-center h-full self-stretch py-6 grid place-content-center gap-2">
          <input {...getInputProps()} />

          <ImageUpIcon size={32} className="mx-auto" />

          <p className="font-medium">
            {isDragActive ? "Drop it here ..." : "Drag & drop your thumbnail"}
          </p>

          <p className="text-sm text-muted-foreground">
            or click to upload an image
          </p>
        </CardContent>
      )}
    </Card>
  );
}
