"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { ImageUpIcon, XIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { Card, CardContent } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";

interface Props {
  img: string;
  setImg: Dispatch<SetStateAction<string>>;
}

export default function UploadCard({ img, setImg }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const imgURL = URL.createObjectURL(file);
        setImg(imgURL);
      }
    },
    [setImg]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleClear = useCallback(() => {
    if (img) {
      URL.revokeObjectURL(img);
    }
    setImg("");
  }, [img]);

  return (
    <Card
      {...getRootProps()}
      className={`max-w-md w-full mx-auto py-0 border-dashed border-2 aspect-video overflow-hidden justify-center items-center ${
        (isDragActive || isHovered) && !img ? "border-primary/50 bg-muted" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {img ? (
        <>
          <AspectRatio ratio={16 / 9} className="relative w-full h-full group">
            <Image
              src={img}
              alt="Uploaded thumbnail"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              className="absolute top-2 right-2 z-10 rounded-full opacity-0 group-hover:opacity-80 hover:opacity-100"
              onClick={handleClear}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Clear Image</span>
            </Button>
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
