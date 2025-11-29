import Link from "next/link";
import Logo from "../ui/logo";
import { Separator } from "../ui/separator";
import SocialLinks from "../widgets/social-links";
import { ThemeToggle } from "../widgets/theme-toggle";

const NAV_LINKS = [
  {
    label: "About",
    url: "/about",
  },
  {
    label: "FAQ",
    url: "/faq",
  },
  {
    label: "Sponsor",
    url: "/sponsor",
  },
];

export default function Header() {
  return (
    <header className="border-b">
      <div className="wrapper-lg py-6 flex justify-between items-center gap-4">
        <Logo />
        <div className="flex items-center h-5 gap-6">
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.url}>
                {link.label}
              </Link>
            ))}
          </nav>
          <Separator orientation="vertical" />
          <ThemeToggle />
          <Separator orientation="vertical" />
          <SocialLinks />
        </div>
      </div>
    </header>
  );
}
