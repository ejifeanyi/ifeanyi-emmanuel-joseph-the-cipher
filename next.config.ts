import type { NextConfig } from "next";

// The site is exported as plain static files (the `out` folder), which
// Cloudflare Pages serves for free. When paid courses and accounts arrive,
// remove `output: "export"` and deploy with the OpenNext Cloudflare adapter.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
