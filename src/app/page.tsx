import { Button } from "@/components/ui/button";
import Features from "@/components/widgets/features";
import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";
import { GITHUB_URL, SPONSOR_URL } from "@/lib/constants";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <section>
        <div className="wrapper pb-4 pt-8">
          <SectionHeader>
            <SectionTitle>
              Every tool you need to work with{" "}
              <span className="text-accent-foreground">YouTube</span> in one
              place
            </SectionTitle>
            <SectionSubtitle className="text-sm md:text-lg text-secondary-foreground">
              All your favorite YouTube tools in one place — free and easy to
              use! Convert videos to MP3/MP4, download thumbnails, generate
              chapters, and format titles with just a few clicks.
            </SectionSubtitle>
          </SectionHeader>
        </div>
      </section>
      <section>
        <div className="wrapper py-8">
          <Features />
        </div>
      </section>
      <section>
        <div className="wrapper py-8 space-y-8">
          <h2 className="text-2xl font-bold text-center">
            Help maintain the project
          </h2>
          <div className="flex items-center gap-4 mx-auto w-fit">
            <Button asChild>
              <Link href={GITHUB_URL}>
                <FaGithub />
                <span>Contribute</span>
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={SPONSOR_URL} target="_blank">
                <Wallet />
                <span>Sponsor</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
