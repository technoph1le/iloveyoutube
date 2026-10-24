import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="font-logo flex items-center gap-1.5 text-2xl leading-none sm:text-[1.9rem] font-extrabold tracking-tight"
    >
      <span>I</span>
      <svg viewBox="0 0 24 24" className="size-6 text-brand sm:size-8" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"
        />
      </svg>
      <span className="sr-only">love</span>
      <span>YOUTUBE</span>
      <span className="sr-only">, home</span>
    </Link>
  );
}
