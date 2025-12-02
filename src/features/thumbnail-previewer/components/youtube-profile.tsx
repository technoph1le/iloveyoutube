import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DISCORD_URL } from "@/lib/constants";
import Link from "next/link";

export default function YouTubeProfile() {
  return (
    <article className="grid gap-4 py-6 grid-cols-[auto_1fr] items-center">
      <Avatar className="size-40">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex gap-4 items-start">
        <div className="space-y-2 leading-tight">
          <h3 className="font-semibold text-2xl text-ellipsis whitespace-normal">
            Your channel name
          </h3>
          <p className="text-muted-foreground">
            <span className="text-secondary-foreground">@channel</span> • 325k
            subscribers • 245 videos
          </p>
          <p className="text-muted-foreground">The best YouTube channel</p>
          <Link href={DISCORD_URL} className="block">
            discorg.gg/youtube
          </Link>
          <Button className="rounded-full mt-2">Subscribe</Button>
        </div>
      </div>
    </article>
  );
}
