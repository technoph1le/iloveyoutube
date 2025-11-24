import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  const props = {
    width: 150,
    height: 50,
  };

  return (
    <Link href="/">
      <Image
        src="/assets/logo-light.svg"
        alt="Logo"
        {...props}
        className="dark:hidden"
      />
      <Image
        src="/assets/logo-dark.svg"
        alt="Logo"
        {...props}
        className="hidden dark:block"
      />
    </Link>
  );
}
