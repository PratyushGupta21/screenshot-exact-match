export const pageMeta = (title: string, description: string) => ({
  meta: [
    { title: `${title} · RADIX Talent Match` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · RADIX Talent Match` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
