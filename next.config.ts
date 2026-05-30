import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Local dual-domain dev (NEXT_PUBLIC_APP_URL=http://app.localhost:3000)
  allowedDevOrigins: ["app.localhost"],
};

export default nextConfig;
