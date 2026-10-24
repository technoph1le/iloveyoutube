import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="relative border-b border-border">
      <div className="mx-auto flex h-21.25 max-w-[1920px] items-center justify-between gap-4 px-4 sm:px-10 lg:px-20">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-5">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-10 md:mr-5">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[1.05rem] transition-colors hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
