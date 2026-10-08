import type { NextConfig } from "next"

const API_PROXY_TARGET =
  process.env.CIVICFIX_API_PROXY_TARGET?.replace(/\/$/, "") ??
  "https://civicfix-backend-nine.vercel.app/api/v1"

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_PROXY_TARGET}/:path*`,
      },
    ]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
