import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dedicated output avoids locked historical build artifacts in this Windows/OneDrive workspace;
  // Vercel's Next.js builder expects the standard `.next` directory.
  distDir: process.env.VERCEL ? ".next" : ".next-release",
  experimental: { turbopackFileSystemCacheForBuild: false },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/:locale/app/student",
        destination: "/:locale/me",
      },
      {
        source: "/:locale/app/student/:path*",
        destination: "/:locale/me/:path*",
      },
      {
        source: "/:locale/app/teacher",
        destination: "/:locale/teacher-dashboard",
      },
      {
        source: "/:locale/app/teacher/:path*",
        destination: "/:locale/teacher-dashboard/:path*",
      },
    ];
  },
};

export default nextConfig;
