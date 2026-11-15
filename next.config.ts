import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The old /solutions pages are gone. Seniors and care centers have a new
  // home; the two audiences we no longer target go to the front page.
  async redirects() {
    return [
      { source: "/solutions/seniors", destination: "/seniors", permanent: true },
      { source: "/solutions/care-centers", destination: "/senior-living", permanent: true },
      { source: "/solutions/disabilities", destination: "/", permanent: true },
      { source: "/solutions/children", destination: "/", permanent: true },
      { source: "/solutions", destination: "/", permanent: true },
    ];
  },
  turbopack: {
    // Pin the workspace root so stray lockfiles in parent folders are ignored.
    root: fileURLToPath(new URL(".", import.meta.url)),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
