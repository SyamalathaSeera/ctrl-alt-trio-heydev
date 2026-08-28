import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = githubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: "/ctrl-alt-trio-heydev",
      assetPrefix: "/ctrl-alt-trio-heydev",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
