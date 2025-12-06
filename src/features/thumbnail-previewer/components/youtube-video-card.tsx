import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { VideoType, YouTubeVideoCardProps } from "../types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props extends YouTubeVideoCardProps {
  video: VideoType;
}

export default function YouTubeVideoCard({
  video,
  orientation = "vertical",
  variant = "desktop",
  withoutAvatar = false,
  withoutChannel = false,
  withoutDescription = false,
  withoutTags = false,
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
            className="w-full rounded-xl overflow-hidden"
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
              <h3
                className={cn(
                  "font-semibold leading-tight",
                  variant === "mobile" ? "text-base" : "text-2xl"
                )}
              >
                {video.title}
              </h3>
              <p className="text-muted-foreground leading-tight">
                36k views • 1 week ago
              </p>
            </div>
            <div className="flex gap-2 items-center">
              {withoutAvatar ? null : (
                <Avatar className="size-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}

              <p className="text-muted-foreground leading-tight">
                {video.channel}
              </p>
            </div>
            {withoutDescription ? null : (
              <p className="truncate overflow-hidden h-5 max-w-lg leading-tight text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
                porro cum dolorum totam quam eveniet ipsum nesciunt veniam
                consequatur sed. Vitae alias expedita soluta quo.
              </p>
            )}

            {withoutTags ? null : (
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
            )}
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
            {withoutAvatar ? null : (
              <Avatar className="size-10 mt-1">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1">
              <h3
                className={cn(
                  "font-semibold  leading-tight text-ellipsis whitespace-normal",
                  withoutAvatar ? "text-base" : "text-sm"
                )}
              >
                {video.title}
              </h3>
              {variant === "desktop" ? (
                <p className="text-muted-foreground leading-tight">
                  {withoutChannel ? null : (
                    <span className="block">{video.channel}</span>
                  )}
                  <span>36k views • 1 week ago</span>
                </p>
              ) : (
                <p className="text-muted-foreground leading-tight">
                  {withoutChannel ? null : <span>{video.channel} • </span>}
                  36k views • 1 week ago
                </p>
              )}
            </div>
          </div>
        </article>
      )}
    </>
  );
}
