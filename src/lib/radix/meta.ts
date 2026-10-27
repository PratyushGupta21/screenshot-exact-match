export const pageMeta = (title: string, description: string) => ({
  meta: [
    { title: `${title} · CAIRN Talent Intelligence` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · CAIRN Talent Intelligence` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
