export default async function sitemap() {
  const baseUrl = "https://full-stack-blogs-projects.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
