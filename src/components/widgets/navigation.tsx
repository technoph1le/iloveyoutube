"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";

import { useIsMobile } from "@/hooks/use-mobile";

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
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Skeleton } from "../ui/skeleton";
import { Authenticated, Unauthenticated } from "convex/react";
import { LogInIcon } from "lucide-react";

export default function Navigation() {
  const { isMounted, isMobile } = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMounted) return null;

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
              <DropdownMenuGroup className="flex items-center">
                <DropdownMenuLabel className="flex items-center">
                  <Authenticated>
                    <UserButton />
                  </Authenticated>
                  <Unauthenticated>
                    <SignInButton>
                      <Button>
                        <LogInIcon />
                        Sign in
                      </Button>
                    </SignInButton>
                  </Unauthenticated>
                </DropdownMenuLabel>
                <DropdownMenuLabel>
                  <ThemeToggle />
                </DropdownMenuLabel>
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
              <ClerkLoading>
                <Skeleton className="w-9 h-9" />
              </ClerkLoading>

              <ClerkLoaded>
                <Authenticated>
                  <NavigationMenuLink href="#">
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
              </ClerkLoaded>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </>
  );
}
