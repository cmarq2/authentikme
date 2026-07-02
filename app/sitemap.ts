import type { MetadataRoute } from "next"

const siteUrl = "https://www.authentikme.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/login", "/candidate/signup", "/employer/signup"]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }))
}
