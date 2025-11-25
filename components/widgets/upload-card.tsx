"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { ImageUpIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { Card, CardContent } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";

interface Props {
  onUpload: (file: File) => void;
  imgPath: string;
  setImgPath: Dispatch<SetStateAction<string>>;
}

export default function UploadCard({ onUpload, imgPath, setImgPath }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const imgURL = URL.createObjectURL(file);
        setImgPath(imgURL);
        onUpload(file);
      }
    },
    [setImgPath, onUpload]
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
        (isDragActive || isHovered) && !imgPath
          ? "border-primary/50 bg-muted"
          : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imgPath ? (
        <>
          <AspectRatio ratio={16 / 9} className="w-full h-full">
            <Image src={imgPath} alt="Uploaded thumbnail" fill />
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
