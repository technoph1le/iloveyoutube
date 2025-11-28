import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex gap-1 items-center text-2xl font-bold animate-pulse-heart"
    >
      <span>I</span>
      <HeartIcon
        fill="var(--color-accent-foreground)"
        color="var(--color-accent-foreground)"
        className="transition-transform duration-300"
      />
      <span>YOUTUBE</span>
    </Link>
  );
}
