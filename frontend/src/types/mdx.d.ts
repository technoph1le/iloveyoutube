// Every blog post exports its metadata next to the default component.
declare module "*.mdx" {
  export const metadata: import("@/data/blog").PostMeta;
}
