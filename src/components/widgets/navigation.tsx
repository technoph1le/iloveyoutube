"use client";

import { ComponentType, useState } from "react";
import { LucideProps, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";

import useIsMobile from "@/hooks/use-mobile";

import { FEATURES } from "@/data/features";
import { SOCIAL_LINKS } from "@/data/social-links";
import { NAV_LINKS } from "@/data/nav-links";

import { ThemeToggle } from "@/components/widgets/theme-toggle";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {isMobile ? (
        <>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-48 grid">
              <DropdownMenuGroup>
                {NAV_LINKS.map((item) => (
                  <DropdownMenuItem key={item.label}>
                    <Link href={item.url} className="w-full py-1">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <ThemeToggle />
              </DropdownMenuLabel>
              <DropdownMenuGroup className="flex flex-wrap gap-2 m-2">
                {SOCIAL_LINKS.map(({ label, url, icon: Icon }) => (
                  <DropdownMenuItem key={label}>
                    <Link href={url} target="_blank" rel="noopener noreferrer">
                      <Icon className="size-5" />
                      <span className="sr-only">{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <NavigationMenu viewport={isMobile} className="z-50">
          <NavigationMenuList className="flex-wrap gap-4">
            {NAV_LINKS.map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink asChild>
                  <Link href={item.url}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {Object.entries(FEATURES).map(([key, feature]) => (
                    <ListItem
                      key={key}
                      title={feature.title}
                      href={feature.link}
                      icon={feature.icon}
                    >
                      {feature.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>

            {SOCIAL_LINKS.map(({ label, url, icon: Icon }) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink asChild>
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    <Icon className="size-5" />
                    <span className="sr-only">{label}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </>
  );
}

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon: ComponentType<LucideProps>;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="grid gap-4 grid-cols-[auto_1fr]">
            <Icon className="size-6" />
            <div className="space-y-2">
              <h3 className="text-base leading-none font-semibold">{title}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                {children}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
