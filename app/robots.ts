import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/candidate/dashboard", "/employer/dashboard"],
    },
    sitemap: "https://www.authentikme.com/sitemap.xml",
  }
}
