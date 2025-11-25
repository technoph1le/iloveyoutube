import { BellIcon, MicIcon, PlusIcon, SearchIcon } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { YouTubeLogo } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function YouTubeHeader() {
  return (
    <header className="flex gap-4 justify-between items-center">
      <YouTubeLogo />
      <div className="flex gap-2 items-center">
        <ButtonGroup className="rounded-full overflow-hidden w-md">
          <Input placeholder="Search" className="rounded-full" />
          <Button
            variant="outline"
            aria-label="Search"
            className="rounded-full"
          >
            <SearchIcon />
          </Button>
        </ButtonGroup>
        <Button variant="secondary" size="icon" className="rounded-full">
          <MicIcon />
        </Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button variant="secondary" className="rounded-full">
          <PlusIcon />
          Create
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <BellIcon />
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
