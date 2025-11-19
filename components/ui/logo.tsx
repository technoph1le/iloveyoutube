import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  const props = {
    width: 150,
    height: 50,
    alt: "Logo",
  };

  return (
    <Link href="/">
      <Image src="/logo-light.svg" {...props} className="dark:hidden" />
      <Image src="/logo-dark.svg" {...props} className="hidden dark:block" />
    </Link>
  );
}
