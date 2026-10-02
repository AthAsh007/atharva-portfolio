import path from "node:path";
import type { NextConfig } from "next";

/**
 * Static export for Cloudflare Pages (edge Workers). The portfolio has no
 * server runtime: it prerenders to a standalone `out/` directory, so it deploys
 * anywhere static. `next build` emits the export; `wrangler pages deploy out`
 * ships it. A `public/_redirects` file (copied to `out/`) keeps hash anchors
 * working on direct navigation.
 */
const nextConfig: NextConfig = {
  output: "export",
  // no next/image optimization (none used, but pin it for safety on export)
  images: { unoptimized: true },
  reactStrictMode: true,
  // pin the tracing root so Next does not walk up to a parent lockfile
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
