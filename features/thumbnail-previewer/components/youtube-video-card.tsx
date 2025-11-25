import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { VideoCardType } from "../types";

interface Props {
  video: VideoCardType;
}

export default function YouTubeVideoCard({ video }: Props) {
  return (
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
          <p className="text-muted-foreground leading-tight">{video.channel}</p>
          <p className="text-muted-foreground leading-tight">
            36k views • 1 week ago
          </p>
        </div>
      </div>
    </article>
  );
}
