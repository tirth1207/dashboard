import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lifeos/ui", "@lifeos/shared", "@lifeos/analytics"],
  experimental: { optimizePackageImports: ["recharts"] }
};

export default nextConfig;
