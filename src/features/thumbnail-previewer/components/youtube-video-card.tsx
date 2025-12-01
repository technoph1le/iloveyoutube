import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { VideoCardType } from "../types";
import { Badge } from "@/components/ui/badge";

interface Props {
  video: VideoCardType;
  orientation: "horizontal" | "vertical";
}

export default function YouTubeVideoCard({
  video,
  orientation = "vertical",
}: Props) {
  const { title, thumbnail, channel } = video;

  if (!title || !thumbnail || !channel) return null;

  return (
    <>
      {orientation === "horizontal" ? (
        <article
          key={video.thumbnail}
          className="grid gap-4 grid-cols-[2fr_3fr]"
        >
          <AspectRatio
            ratio={16 / 9}
            className="w-full h-full rounded-xl overflow-hidden"
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-2xl leading-tight text-ellipsis whitespace-normal">
                {video.title}
              </h3>
              <p className="text-muted-foreground leading-tight">
                36k views • 1 week ago
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Avatar className="size-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground leading-tight">
                {video.channel}
              </p>
            </div>
            <p className="truncate overflow-hidden h-5 max-w-lg leading-tight text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
              porro cum dolorum totam quam eveniet ipsum nesciunt veniam
              consequatur sed. Vitae alias expedita soluta quo.
            </p>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="rounded-xs text-base leading-none py-1 px-2"
              >
                4K
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-xs text-base leading-none py-1 px-2"
              >
                CC
              </Badge>
            </div>
          </div>
        </article>
      ) : (
        <article key={video.thumbnail}>
          <AspectRatio
            ratio={16 / 9}
            className="w-full h-full rounded-xl overflow-hidden"
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <div className="flex gap-4 items-start pt-2">
            <Avatar className="size-10 mt-1">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-tight text-ellipsis whitespace-normal">
                {video.title}
              </h3>
              <p className="text-muted-foreground leading-tight">
                {video.channel}
              </p>
              <p className="text-muted-foreground leading-tight">
                36k views • 1 week ago
              </p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
