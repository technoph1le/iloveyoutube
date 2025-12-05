import { Metadata } from "next";
import { PAGES } from "@/data/pages";

const data = PAGES.about;

export const metadata: Metadata = {
  title: data.title,
  description: data.description,
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
