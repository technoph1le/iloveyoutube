"use client";

import { useState } from "react";
import { LogInIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

import { useIsMobile } from "@/hooks/use-mobile";

import { SOCIAL_LINKS } from "@/data/social-links";
import { NAV_LINKS } from "@/data/nav-links";

import { ThemeToggle } from "@/components/widgets/theme-toggle";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
        <NavigationMenu viewport={isMobile} className="z-30">
          <NavigationMenuList className="flex-wrap gap-4">
            {NAV_LINKS.map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink asChild>
                  <Link href={item.url}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Authenticated>
                <NavigationMenuLink>
                  <UserButton />
                </NavigationMenuLink>
              </Authenticated>
              <Unauthenticated>
                <SignInButton>
                  <Button>
                    <LogInIcon />
                    Sign in
                  </Button>
                </SignInButton>
              </Unauthenticated>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </>
  );
}
