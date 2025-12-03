"use client";

import Navigation from "@/components/widgets/navigation";
import Logo from "@/components/ui/logo";

export default function Header() {
  return (
    <header className="border-b">
      <div className="wrapper-lg py-4 flex justify-between items-center gap-4">
        <Logo />

        <Navigation />
      </div>
    </header>
  );
}
